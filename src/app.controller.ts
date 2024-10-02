import { Body, Controller, Get, HttpRedirectResponse, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Order } from './Order';
import { OrderDto } from './Order.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndex() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('order')
  @Render('orderForm')
  getOrderForm() {
    return {
      data: {},
      errors: [],
      products: [
        { id: 1, name: 'Product 1', image: 'https://picsum.photos/id/237/200/300' },
        { id: 2, name: 'Product 2', image: 'https://picsum.photos/id/237/200/300' },
        { id: 3, name: 'Product 3', image: 'https://picsum.photos/id/237/200/300' }
      ]
    };
  }

  @Post('order')
    createOrder(
    @Body() orderDto: OrderDto,
    @Res() response: Response
  ) {
    let errors = [];

    // Validate product selection
    if (!orderDto.productId) {
      errors.push('Please select a product');
    }

    // Validate name
    if (!orderDto.name) {
      errors.push('Please enter your name');
    }

    // Validate billing and shipping addresses
    if (!orderDto.billingAddress.country || !orderDto.billingAddress.zipCode || !orderDto.billingAddress.city || !orderDto.billingAddress.street || !orderDto.billingAddress.houseNumber) {
      errors.push('Please enter your billing address');
    }
    if (!orderDto.shippingAddress.country || !orderDto.shippingAddress.zipCode || !orderDto.shippingAddress.city || !orderDto.shippingAddress.street || !orderDto.shippingAddress.houseNumber) {
      errors.push('Please enter your shipping address');
    }

    // Validate coupon code
    if (orderDto.couponCode && !/^[A-Z]{2}-\d{4}$/.test(orderDto.couponCode)) {
      errors.push('Invalid coupon code format');
    }

    // Validate payment method
    if (!orderDto.paymentMethod.cardNumber || !orderDto.paymentMethod.expirationDate || !orderDto.paymentMethod.securityCode) {
      errors.push('Please enter your payment method details');
    }
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(orderDto.paymentMethod.cardNumber)) {
      errors.push('Invalid card number format');
    }
    if (!/^\d{2}\/\d{2}$/.test(orderDto.paymentMethod.expirationDate)) {
      errors.push('Invalid expiration date format');
    }
    if (!/^\d{3}$/.test(orderDto.paymentMethod.securityCode)) {
      errors.push('Invalid security code format');
    }

    if (errors.length > 0) {
      response.render('orderForm', {
        data: orderDto,
        errors
      });
      return;
    }

    const order: Order = {
      productId: orderDto.productId,
      name: orderDto.name,
      billingAddress: orderDto.billingAddress,
      shippingAddress: orderDto.shippingAddress,
      couponCode: orderDto.couponCode,
      paymentMethod: orderDto.paymentMethod
    };

    console.log('Rendelés sikeresen leadva:', order);

    response.redirect('/orderSuccess');
  }

  @Get('orderSuccess')
  getOrderSuccess() {
    return 'Sikeres rendelés';
  }
}
