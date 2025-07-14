export const createResponse = {
  success: <T>(data: T, message?: string) => ({
    success: true,
    data,
    message: message || 'Operación exitosa',
  }),

  error: <T>(message: string, details?: T) => ({
    success: false,
    error: message,
    details,
  }),

  paginated: <T>(data: T, page: number, limit: number, total: number) => ({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }),
}
