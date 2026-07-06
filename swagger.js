const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Admin Panel API',
    version: '1.0.0',
    description: 'RESTful API for Admin Panel - Mahsulotlar va Zakaslar boshqaruvi',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server (lokal)'
    },
    {
      url: 'https://admin-backend-xxxx.onrender.com',
      description: 'Production server (Render.com)'
    }
  ],
  tags: [
    {
      name: 'Products',
      description: 'Mahsulotlar boshqaruvi'
    },
    {
      name: 'Orders',
      description: 'Buyurtmalar boshqaruvi'
    },
    {
      name: 'Customer Orders',
      description: 'Klientlar zakasi'
    },
    {
      name: 'Auth',
      description: 'Autentifikatsiya'
    },
    {
      name: 'Stats',
      description: 'Statistika'
    },
    {
      name: 'Health',
      description: 'Server holati'
    }
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['name', 'weight'],
        properties: {
          id: {
            type: 'integer',
            description: 'Mahsulot ID (avtomatik)',
            example: 1783276315777
          },
          name: {
            type: 'string',
            description: 'Mahsulot nomi',
            example: 'Coca Cola'
          },
          image: {
            type: 'string',
            description: 'Rasm URL',
            example: 'https://example.com/image.jpg'
          },
          stock: {
            type: 'integer',
            description: 'Sklad miqdori',
            example: 1000
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Narx (USD)',
            example: 1.50
          },
          category: {
            type: 'string',
            description: 'Kategoriya',
            example: 'Ichimliklar'
          },
          weight: {
            type: 'integer',
            description: 'Og\'irligi (gramm)',
            example: 500
          },
          packQuantity: {
            type: 'integer',
            description: 'Quti ichida nechta',
            example: 24
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Yaratilgan sana'
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Buyurtma ID',
            example: 1783277338870
          },
          orderNumber: {
            type: 'string',
            description: 'Buyurtma raqami',
            example: '#ORD-001'
          },
          customer: {
            type: 'string',
            description: 'Mijoz ismi',
            example: 'Samar'
          },
          phone: {
            type: 'string',
            description: 'Telefon raqam',
            example: '+998901234567'
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Buyurtma sanasi'
          },
          status: {
            type: 'string',
            enum: ['Jo\'natilmagan', 'Jo\'natilgan', 'Bekor qilindi'],
            description: 'Buyurtma holati',
            example: 'Jo\'natilmagan'
          },
          warehouse: {
            type: 'string',
            description: 'Sklad',
            example: 'Склад'
          },
          address: {
            type: 'string',
            description: 'Yetkazib berish manzili',
            example: 'Toshkent, Chilonzor'
          },
          comment: {
            type: 'string',
            description: 'Izoh',
            example: 'Tezroq yetkazib bering'
          },
          currency: {
            type: 'string',
            enum: ['USD', 'UZS'],
            description: 'Valyuta',
            example: 'USD'
          },
          lines: {
            type: 'array',
            description: 'Buyurtma qatorlari',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1783277335256
                },
                productId: {
                  type: 'integer',
                  example: 1783276360742
                },
                name: {
                  type: 'string',
                  example: 'Coca Cola'
                },
                image: {
                  type: 'string',
                  example: 'https://example.com/image.jpg'
                },
                qty: {
                  type: 'integer',
                  example: 10
                },
                price: {
                  type: 'number',
                  example: 1.50
                },
                discount: {
                  type: 'number',
                  example: 0
                }
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      CustomerOrder: {
        type: 'object',
        required: ['customerName', 'phoneNumber', 'productId'],
        properties: {
          id: {
            type: 'integer',
            description: 'Zakas ID'
          },
          customerName: {
            type: 'string',
            description: 'Mijoz ismi (kamida 3 ta harf)',
            example: 'Ali'
          },
          phoneNumber: {
            type: 'string',
            description: 'Telefon raqam (faqat raqamlar)',
            example: '998901234567'
          },
          productId: {
            type: 'integer',
            description: 'Mahsulot ID',
            example: 1783276315777
          },
          productName: {
            type: 'string',
            description: 'Mahsulot nomi',
            example: 'Coca Cola'
          },
          productPrice: {
            type: 'number',
            description: 'Mahsulot narxi',
            example: 1.50
          },
          productWeight: {
            type: 'integer',
            description: 'Mahsulot og\'irligi',
            example: 500
          },
          productPackQuantity: {
            type: 'integer',
            description: 'Quti ichida',
            example: 24
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'cancelled'],
            description: 'Zakas holati',
            example: 'pending'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Xatolik yuz berdi'
          },
          error: {
            type: 'string',
            example: 'Error details'
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            description: 'Response data'
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./server.js'] // server.js faylidan annotation o'qish
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
