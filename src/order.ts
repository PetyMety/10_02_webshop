export interface Order {
  productId: number;
  name: string;
  billingAddress: {
    country: string;
    zipCode: string;
    city: string;
    street: string;
    houseNumber: string;
  };
  shippingAddress: {
    country: string;
    zipCode: string;
    city: string;
    street: string;
    houseNumber: string;
  };
  couponCode: string;
  paymentMethod: {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
  };
}
