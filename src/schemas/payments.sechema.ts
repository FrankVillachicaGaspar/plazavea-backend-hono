import { z } from '@hono/zod-openapi'

export const CreatePaymentSchema = z.object({
  // Información de contacto
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .openapi({ example: 'Juan', description: 'Nombre del cliente' }),

  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .openapi({ example: 'Pérez', description: 'Apellido del cliente' }),

  email: z
    .string()
    .email('Email inválido')
    .openapi({ example: 'juan@example.com', description: 'Email del cliente' }),

  // Información de pago
  subtotal: z
    .number()
    .min(0, 'El subtotal debe ser mayor a 0')
    .openapi({ example: 100.5, description: 'Subtotal antes del envío' }),

  envio: z
    .number()
    .min(0, 'El envío no puede ser negativo')
    .default(0)
    .openapi({ example: 15.0, description: 'Costo de envío' }),

  total: z
    .number()
    .min(0, 'El total debe ser mayor a 0')
    .openapi({ example: 115.5, description: 'Total del pago' }),

  metodo: z
    .enum(['card', 'paypal', 'transfer'])
    .openapi({ example: 'card', description: 'Método de pago seleccionado' }),

  // Datos de tarjeta (condicionales según el método)
  numeroTarjeta: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Formato de tarjeta inválido')
    .optional()
    .openapi({
      example: '1234 5678 9012 3456',
      description: 'Número de tarjeta (solo para método card)',
    }),

  fechaVencimiento: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato de fecha inválido (MM/YY)')
    .optional()
    .openapi({ example: '12/26', description: 'Fecha de vencimiento (MM/YY)' }),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos')
    .optional()
    .openapi({ example: '123', description: 'Código de seguridad CVV' }),

  nombreTarjeta: z
    .string()
    .min(1, 'El nombre en la tarjeta es requerido')
    .max(100, 'El nombre es muy largo')
    .optional()
    .openapi({
      example: 'Juan Pérez',
      description: 'Nombre como aparece en la tarjeta',
    }),

  ultima4: z
    .string()
    .length(4, 'Debe tener exactamente 4 dígitos')
    .regex(/^\d{4}$/, 'Solo se permiten números')
    .optional()
    .openapi({
      example: '3456',
      description: 'Últimos 4 dígitos de la tarjeta',
    }),

  // Dirección de facturación
  direccion: z
    .string()
    .min(1, 'La dirección es requerida')
    .max(200, 'La dirección es muy larga')
    .openapi({
      example: 'Calle Principal 123',
      description: 'Dirección de facturación',
    }),

  ciudad: z
    .string()
    .min(1, 'La ciudad es requerida')
    .max(100, 'El nombre de la ciudad es muy largo')
    .openapi({ example: 'Lima', description: 'Ciudad de facturación' }),

  codigoPostal: z
    .string()
    .min(1, 'El código postal es requerido')
    .max(10, 'Código postal inválido')
    .openapi({ example: '15001', description: 'Código postal' }),

  pais: z
    .string()
    .min(1, 'El país es requerido')
    .openapi({ example: 'Perú', description: 'País de facturación' }),

  // Términos y condiciones
  terminosAceptados: z
    .boolean()
    .refine(val => val === true, 'Debe aceptar los términos y condiciones')
    .openapi({
      example: true,
      description: 'Confirmación de aceptación de términos',
    }),

  // Metadatos opcionales
  ip: z.string().ip('IP inválida').optional().openapi({
    example: '192.168.1.1',
    description: 'Dirección IP del cliente',
  }),

  userAgent: z.string().optional().openapi({
    example: 'Mozilla/5.0...',
    description: 'User agent del navegador',
  }),
})

export const CreatePaymentDetailSchema = z.object({
  pagoId: z.number().openapi({ example: 1, description: 'Id del pago' }),
  productoId: z
    .number()
    .openapi({ example: 1, description: 'Id del producto' }),
  cantidad: z
    .number()
    .openapi({ example: 1, description: 'Cantidad de productos' }),
  precioUnitario: z
    .number()
    .openapi({ example: 100, description: 'Precio unitario del producto' }),
})

export const ResponsePaymentDetailSchema = z.object({
  pagoId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del pago' }),
  productoId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del producto' }),
  cantidad: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Cantidad de productos' }),
  precioUnitario: z
    .number()
    .positive()
    .openapi({ example: 100, description: 'Precio unitario del producto' }),
})

export const ResponsePayment = z.object({
  id: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del pago' }),
  usuarioId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del usuario' }),
  total: z
    .number()
    .positive()
    .openapi({ example: 0, description: 'Total del pago' }),
  fecha: z
    .string()
    .openapi({ example: '2023-01-01', description: 'Fecha del pago' }),
  metodo: z
    .string()
    .min(1)
    .openapi({ example: 'Visa', description: 'Metodo de pago' }),
  ultima4: z
    .string()
    .length(4)
    .nullable()
    .openapi({ example: '4242', description: 'Ultimos 4 digitos' }),
  estado: z
    .string()
    .openapi({ example: 'Pendiente', description: 'Estado del pago' }),
  referencia: z
    .string()
    .nullable()
    .openapi({ example: '123456', description: 'Referencia del pago' }),
})
