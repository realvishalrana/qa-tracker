/**
 * @openapi
 * components:
 *   schemas:
 *     ApiSuccess:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data: {}
 *         meta:
 *           type: object
 *           properties:
 *             total: { type: number }
 *             page: { type: number }
 *             limit: { type: number }
 *     ApiError:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         error:
 *           type: object
 *           properties:
 *             message: { type: string }
 *             details: { type: object }
 *     SystemRole:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string, example: Admin }
 *         description: { type: string }
 *     AuthUser:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         email: { type: string }
 *         name: { type: string }
 *         roleNames:
 *           type: array
 *           items: { type: string }
 *         permissions:
 *           type: array
 *           items: { type: string }
 *     ProjectRole:
 *       type: string
 *       enum: [OWNER, LEAD, DEVELOPER, QA, MEMBER]
 */
export {};
