import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Order, OrderEvent, Product, User, UserRole, Voucher } from '../types';
import { SEED_ORDERS, SEED_PRODUCTS, SEED_USERS, SEED_VOUCHERS } from '../data/seed';

const SCHEMA_VERSION = 1;

interface AppState {
  version: number;
  currentUser: User;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  vouchers: Voucher[];
  appliedVoucherCode: string | null;

  // Role actions
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;

  // Cart actions
  addToCart: (productId: string, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Voucher actions
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;

  // Order actions
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod?: 'COD';
  }) => { success: boolean; orderId?: string; message: string };

  // Order fulfillment actions
  sellerConfirmOrder: (orderId: string) => { success: boolean; message: string };
  sellerReadyForPickup: (orderId: string) => { success: boolean; message: string };
  shipperAcceptDelivery: (orderId: string, shipperId: string, shipperName: string) => { success: boolean; message: string };
  shipperCompleteDelivery: (orderId: string) => { success: boolean; message: string };
  cancelOrder: (orderId: string, reason: string) => { success: boolean; message: string };

  // Product actions
  createProduct: (productData: {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    images: string[];
    sellerId: string;
    sellerName: string;
  }) => { success: boolean; product?: Product; message: string };

  updateProduct: (productId: string, patch: Partial<Product>) => { success: boolean; message: string };
  adminApproveProduct: (productId: string) => { success: boolean; message: string };
  adminRejectProduct: (productId: string, reason: string) => { success: boolean; message: string };

  // System
  resetToSeedData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      version: SCHEMA_VERSION,
      currentUser: SEED_USERS[0], // default: customer Nguyễn Văn An
      products: SEED_PRODUCTS,
      cart: [],
      orders: SEED_ORDERS,
      vouchers: SEED_VOUCHERS,
      appliedVoucherCode: null,

      switchRole: (role: UserRole) => {
        const found = SEED_USERS.find((u) => u.role === role);
        if (found) {
          set({ currentUser: found });
        }
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },

      addToCart: (productId: string, quantity = 1) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);

        if (!product) {
          return { success: false, message: 'Sản phẩm không tồn tại.' };
        }

        if (product.status !== 'APPROVED') {
          return { success: false, message: 'Sản phẩm này chưa được mở bán.' };
        }

        if (product.stock <= 0) {
          return { success: false, message: 'Sản phẩm này hiện đang hết hàng.' };
        }

        const existingItem = state.cart.find((item) => item.productId === productId);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          return {
            success: false,
            message: `Rất tiếc! Số lượng mua vượt quá số lượng còn lại trong kho (${product.stock} sản phẩm).`,
          };
        }

        // Multi-seller warning/check: check if existing cart has items from another seller
        if (state.cart.length > 0) {
          const firstItem = state.cart[0];
          const firstProduct = state.products.find((p) => p.id === firstItem.productId);
          if (firstProduct && firstProduct.sellerId !== product.sellerId) {
            return {
              success: false,
              message: `Giỏ hàng hiện đang có sản phẩm của gian hàng khác. Vui lòng thanh toán đơn hiện tại trước khi mua từ "${product.sellerName}".`,
            };
          }
        }

        if (existingItem) {
          set({
            cart: state.cart.map((item) =>
              item.productId === productId ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          set({
            cart: [
              ...state.cart,
              {
                productId,
                quantity: newQty,
                sellerId: product.sellerId,
              },
            ],
          });
        }

        return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng thành công!' };
      },

      updateCartQuantity: (productId: string, quantity: number) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);
        if (!product) return;

        if (quantity <= 0) {
          set({ cart: state.cart.filter((item) => item.productId !== productId) });
          return;
        }

        const cappedQty = Math.min(quantity, Math.max(1, product.stock));
        set({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: cappedQty } : item
          ),
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => {
        set({ cart: [], appliedVoucherCode: null });
      },

      applyVoucher: (code: string) => {
        const state = get();
        const voucher = state.vouchers.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
        if (!voucher) {
          return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
        }

        // Calculate current subtotal
        let subtotal = 0;
        for (const item of state.cart) {
          const prod = state.products.find((p) => p.id === item.productId);
          if (prod) {
            subtotal += prod.price * item.quantity;
          }
        }

        if (subtotal < voucher.minOrderValue) {
          return {
            success: false,
            message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)} ₫ trở lên.`,
          };
        }

        set({ appliedVoucherCode: voucher.code });
        return { success: true, message: `Áp dụng thành công mã ưu đãi "${voucher.code}"!` };
      },

      removeVoucher: () => {
        set({ appliedVoucherCode: null });
      },

      createOrder: (orderData) => {
        const state = get();
        if (state.cart.length === 0) {
          return { success: false, message: 'Giỏ hàng của bạn đang trống.' };
        }

        // Verify stock for all items
        for (const cartItem of state.cart) {
          const prod = state.products.find((p) => p.id === cartItem.productId);
          if (!prod) {
            return { success: false, message: 'Một số sản phẩm trong giỏ không còn tồn tại.' };
          }
          if (prod.stock < cartItem.quantity) {
            return {
              success: false,
              message: `Sản phẩm "${prod.title}" không đủ số lượng tồn kho (còn ${prod.stock}).`,
            };
          }
        }

        // Prepare order items and calculations
        let subtotal = 0;
        const sellerId = state.cart[0].sellerId;
        const firstProd = state.products.find((p) => p.id === state.cart[0].productId);
        const sellerName = firstProd ? firstProd.sellerName : 'Gian hàng đối tác';

        const orderItems = state.cart.map((cartItem) => {
          const prod = state.products.find((p) => p.id === cartItem.productId)!;
          const lineTotal = prod.price * cartItem.quantity;
          subtotal += lineTotal;
          return {
            productId: prod.id,
            title: prod.title,
            price: prod.price,
            quantity: cartItem.quantity,
            image: prod.images[0] || '',
          };
        });

        const shippingFee = 25000;
        let discount = 0;
        if (state.appliedVoucherCode) {
          const voucher = state.vouchers.find((v) => v.code === state.appliedVoucherCode);
          if (voucher && subtotal >= voucher.minOrderValue) {
            if (voucher.code === 'FREESHIP') {
              discount = Math.min(shippingFee, voucher.maxDiscount);
            } else {
              discount = Math.min(Math.round((subtotal * voucher.discountPercent) / 100), voucher.maxDiscount);
            }
          }
        }

        const totalAmount = Math.max(0, subtotal + shippingFee - discount);
        const orderTimestamp = new Date().toISOString();
        const randIdSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randIdSuffix}`;

        const initialTimeline: OrderEvent[] = [
          {
            id: `evt-${Date.now()}-1`,
            status: 'PENDING_CONFIRMATION',
            title: 'Đặt hàng thành công',
            timestamp: orderTimestamp,
            note: 'Đơn hàng mới tạo qua hình thức Thanh toán khi nhận hàng (COD). Chờ shop xác nhận.',
            actorRole: 'customer',
          },
        ];

        const newOrder: Order = {
          id: orderId,
          customerId: state.currentUser.id,
          customerName: orderData.customerName.trim() || state.currentUser.name,
          customerPhone: orderData.customerPhone.trim() || state.currentUser.phone || '0912345678',
          customerAddress: orderData.customerAddress.trim() || state.currentUser.address || 'Hà Nội / TP.HCM',
          sellerId,
          sellerName,
          items: orderItems,
          subtotal,
          shippingFee,
          discount,
          voucherCode: state.appliedVoucherCode || undefined,
          totalAmount,
          paymentMethod: 'COD',
          status: 'PENDING_CONFIRMATION',
          timeline: initialTimeline,
          createdAt: orderTimestamp,
          updatedAt: orderTimestamp,
        };

        // Deduct product stock exactly once
        const updatedProducts = state.products.map((prod) => {
          const orderedItem = state.cart.find((ci) => ci.productId === prod.id);
          if (orderedItem) {
            return {
              ...prod,
              stock: Math.max(0, prod.stock - orderedItem.quantity),
              soldCount: prod.soldCount + orderedItem.quantity,
            };
          }
          return prod;
        });

        set({
          products: updatedProducts,
          orders: [newOrder, ...state.orders],
          cart: [],
          appliedVoucherCode: null,
        });

        return {
          success: true,
          orderId,
          message: 'Đặt hàng COD thành công!',
        };
      },

      sellerConfirmOrder: (orderId: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Đơn hàng không tồn tại.' };
        if (order.status !== 'PENDING_CONFIRMATION') {
          return { success: false, message: 'Trạng thái đơn hàng không hợp lệ để xác nhận.' };
        }

        const now = new Date().toISOString();
        const newEvent: OrderEvent = {
          id: `evt-${Date.now()}`,
          status: 'PREPARING',
          title: 'Shop đã xác nhận đơn hàng',
          timestamp: now,
          note: 'Người bán đã tiếp nhận đơn và đang chuẩn bị đóng gói sản phẩm.',
          actorRole: 'seller',
        };

        set({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'PREPARING',
                  updatedAt: now,
                  timeline: [...o.timeline, newEvent],
                }
              : o
          ),
        });

        return { success: true, message: 'Đã xác nhận đơn hàng và chuyển sang Chuẩn bị hàng.' };
      },

      sellerReadyForPickup: (orderId: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Đơn hàng không tồn tại.' };
        if (order.status !== 'PREPARING') {
          return { success: false, message: 'Đơn hàng phải ở trạng thái "Đang chuẩn bị hàng".' };
        }

        const now = new Date().toISOString();
        const newEvent: OrderEvent = {
          id: `evt-${Date.now()}`,
          status: 'AWAITING_PICKUP',
          title: 'Hàng đã đóng gói xong - Chờ Shipper',
          timestamp: now,
          note: 'Shop đã đóng gói hoàn tất và dán nhãn vận chuyển, chờ Shipper lấy hàng.',
          actorRole: 'seller',
        };

        set({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'AWAITING_PICKUP',
                  updatedAt: now,
                  timeline: [...o.timeline, newEvent],
                }
              : o
          ),
        });

        return { success: true, message: 'Đã cập nhật: Sẵn sàng bàn giao cho Shipper.' };
      },

      shipperAcceptDelivery: (orderId: string, shipperId: string, shipperName: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Đơn hàng không tồn tại.' };
        if (order.status !== 'AWAITING_PICKUP') {
          return { success: false, message: 'Đơn hàng chưa sẵn sàng để shipper nhận.' };
        }

        const now = new Date().toISOString();
        const newEvent: OrderEvent = {
          id: `evt-${Date.now()}`,
          status: 'IN_TRANSIT',
          title: 'Shipper đã lấy hàng và đang đi giao',
          timestamp: now,
          note: `Tài xế ${shipperName} đã tiếp nhận bưu kiện từ người bán và đang trên đường giao tới bạn.`,
          actorRole: 'shipper',
        };

        set({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'IN_TRANSIT',
                  shipperId,
                  shipperName,
                  updatedAt: now,
                  timeline: [...o.timeline, newEvent],
                }
              : o
          ),
        });

        return { success: true, message: 'Đã nhận đơn hàng và chuyển sang Đang giao.' };
      },

      shipperCompleteDelivery: (orderId: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Đơn hàng không tồn tại.' };
        if (order.status !== 'IN_TRANSIT') {
          return { success: false, message: 'Đơn hàng chưa ở trạng thái đang giao hàng.' };
        }

        const now = new Date().toISOString();
        const newEvent: OrderEvent = {
          id: `evt-${Date.now()}`,
          status: 'DELIVERED',
          title: 'Giao hàng thành công',
          timestamp: now,
          note: `Khách hàng đã nhận đủ sản phẩm và thanh toán ${new Intl.NumberFormat('vi-VN').format(order.totalAmount)} ₫ (COD).`,
          actorRole: 'shipper',
        };

        set({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'DELIVERED',
                  updatedAt: now,
                  timeline: [...o.timeline, newEvent],
                }
              : o
          ),
        });

        return { success: true, message: 'Giao hàng thành công! Đã thu tiền COD.' };
      },

      cancelOrder: (orderId: string, reason: string) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, message: 'Đơn hàng không tồn tại.' };
        if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
          return { success: false, message: 'Không thể hủy đơn hàng này.' };
        }

        const now = new Date().toISOString();
        const newEvent: OrderEvent = {
          id: `evt-${Date.now()}`,
          status: 'CANCELLED',
          title: 'Đơn hàng đã bị hủy',
          timestamp: now,
          note: `Lý do hủy: ${reason}`,
          actorRole: state.currentUser.role,
        };

        // Restore stock
        const updatedProducts = state.products.map((prod) => {
          const item = order.items.find((i) => i.productId === prod.id);
          if (item) {
            return {
              ...prod,
              stock: prod.stock + item.quantity,
              soldCount: Math.max(0, prod.soldCount - item.quantity),
            };
          }
          return prod;
        });

        set({
          products: updatedProducts,
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'CANCELLED',
                  updatedAt: now,
                  timeline: [...o.timeline, newEvent],
                }
              : o
          ),
        });

        return { success: true, message: 'Đã hủy đơn hàng và hoàn lại tồn kho.' };
      },

      createProduct: (productData) => {
        const state = get();
        if (!productData.title || productData.title.trim().length < 5) {
          return { success: false, message: 'Tên sản phẩm phải có ít nhất 5 ký tự.' };
        }
        if (productData.price <= 0) {
          return { success: false, message: 'Giá sản phẩm phải lớn hơn 0 ₫.' };
        }
        if (productData.stock < 0) {
          return { success: false, message: 'Số lượng tồn kho không được âm.' };
        }

        const id = `prod-${Date.now()}`;
        const newProduct: Product = {
          id,
          title: productData.title.trim(),
          description: productData.description.trim() || 'Sản phẩm chất lượng cao được phân phối chính hãng.',
          price: productData.price,
          originalPrice: productData.originalPrice || productData.price * 1.3,
          stock: productData.stock,
          category: productData.category || 'Điện tử & Công nghệ',
          images: productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
          rating: 5.0,
          soldCount: 0,
          sellerId: productData.sellerId,
          sellerName: productData.sellerName,
          status: 'PENDING', // P0: new products always start as PENDING for Admin to review
          createdAt: new Date().toISOString(),
          isFeatured: false,
        };

        set({
          products: [newProduct, ...state.products],
        });

        return {
          success: true,
          product: newProduct,
          message: 'Đã đăng sản phẩm thành công! Đang chờ Quản trị viên duyệt (PENDING).',
        };
      },

      updateProduct: (productId: string, patch: Partial<Product>) => {
        const state = get();
        const exists = state.products.some((p) => p.id === productId);
        if (!exists) return { success: false, message: 'Sản phẩm không tồn tại.' };

        set({
          products: state.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
        });

        return { success: true, message: 'Đã cập nhật thông tin sản phẩm thành công.' };
      },

      adminApproveProduct: (productId: string) => {
        const state = get();
        const prod = state.products.find((p) => p.id === productId);
        if (!prod) return { success: false, message: 'Sản phẩm không tồn tại.' };

        set({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, status: 'APPROVED', rejectReason: undefined } : p
          ),
        });

        return { success: true, message: `Đã phê duyệt sản phẩm "${prod.title}". Sản phẩm hiện đã mở bán công khai.` };
      },

      adminRejectProduct: (productId: string, reason: string) => {
        const state = get();
        const prod = state.products.find((p) => p.id === productId);
        if (!prod) return { success: false, message: 'Sản phẩm không tồn tại.' };

        set({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, status: 'REJECTED', rejectReason: reason } : p
          ),
        });

        return { success: true, message: `Đã từ chối duyệt sản phẩm "${prod.title}".` };
      },

      resetToSeedData: () => {
        set({
          version: SCHEMA_VERSION,
          currentUser: SEED_USERS[0],
          products: SEED_PRODUCTS,
          cart: [],
          orders: SEED_ORDERS,
          vouchers: SEED_VOUCHERS,
          appliedVoucherCode: null,
        });
        localStorage.removeItem('minimall-storage');
      },
    }),
    {
      name: 'minimall-storage',
      storage: createJSONStorage(() => localStorage),
      version: SCHEMA_VERSION,
      migrate: (persistedState: any, version: number) => {
        if (version !== SCHEMA_VERSION) {
          return {
            version: SCHEMA_VERSION,
            currentUser: SEED_USERS[0],
            products: SEED_PRODUCTS,
            cart: [],
            orders: SEED_ORDERS,
            vouchers: SEED_VOUCHERS,
            appliedVoucherCode: null,
          };
        }
        return persistedState;
      },
    }
  )
);
