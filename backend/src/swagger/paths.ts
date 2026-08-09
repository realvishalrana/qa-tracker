/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     security: []
 *     responses:
 *       200:
 *         description: OK
 *
 * /auth/login:
 *   post:
 *     summary: Login and set httpOnly JWT cookie
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in
 *
 * /auth/register:
 *   post:
 *     summary: Register new user (default Developer role)
 *     security: []
 *     responses:
 *       201:
 *         description: Registered
 *
 * /auth/me:
 *   get:
 *     summary: Current user with roles and permissions
 *     responses:
 *       200:
 *         description: Auth user profile
 *
 * /auth/logout:
 *   post:
 *     summary: Clear auth cookie
 *     responses:
 *       200:
 *         description: Logged out
 *
 * /roles:
 *   get:
 *     summary: List seeded system roles (read-only)
 *     description: Requires users:manage
 *     responses:
 *       200:
 *         description: Roles with permissions from code map
 *
 * /users:
 *   get:
 *     summary: List users
 *     description: Requires users:manage
 *     responses:
 *       200:
 *         description: User list
 *   post:
 *     summary: Create user
 *     description: Requires users:manage
 *     responses:
 *       201:
 *         description: Created
 *
 * /users/{id}/roles:
 *   patch:
 *     summary: Assign multiple system roles
 *     description: Requires users:manage. Body roleNames array.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleNames:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *
 * /projects:
 *   get:
 *     summary: List accessible projects
 *     responses:
 *       200:
 *         description: Projects
 *   post:
 *     summary: Create project
 *     description: Requires project:create
 *     responses:
 *       201:
 *         description: Created
 *
 * /projects/{id}/members:
 *   get:
 *     summary: List project members with projectRole
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Members
 *   post:
 *     summary: Add member
 *     description: Body uses projectRole (OWNER|LEAD|DEVELOPER|QA|MEMBER)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Member added
 *
 * /projects/{projectId}/bugs:
 *   post:
 *     summary: Create bug in project
 *     description: Requires bug:create and project membership
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Bug created
 *
 * /bugs:
 *   get:
 *     summary: List bugs with filters
 *     responses:
 *       200:
 *         description: Bug list
 *
 * /bugs/{id}/status:
 *   patch:
 *     summary: Update bug status
 *     description: |
 *       Requires bug:status. Status transitions are validated server-side.
 *       Example valid path NEW -> OPEN -> IN_PROGRESS -> RESOLVED -> VERIFIED -> CLOSED.
 *       Invalid transitions return 400 with allowed next statuses.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Invalid status transition
 *
 * /reports/bugs-by-status:
 *   get:
 *     summary: Bugs grouped by status
 *     description: Requires reports:read
 *     responses:
 *       200:
 *         description: Report data
 *
 * /dashboard/summary:
 *   get:
 *     summary: Dashboard summary
 *     responses:
 *       200:
 *         description: Summary stats
 *
 * /audit-logs:
 *   get:
 *     summary: Audit log list
 *     description: Requires audit:read
 *     responses:
 *       200:
 *         description: Audit entries
 *
 * /auth/change-password:
 *   post:
 *     summary: Change password for current user
 *     responses:
 *       200:
 *         description: Password updated
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     description: Requires users:manage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User detail
 *   patch:
 *     summary: Update user
 *     description: Requires users:manage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Deactivate user
 *     description: Requires users:manage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /projects/{id}:
 *   get:
 *     summary: Get project by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Project detail
 *   patch:
 *     summary: Update project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /projects/{id}/members/{userId}:
 *   patch:
 *     summary: Update member projectRole
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Remove project member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed
 *
 * /projects/{id}/activity:
 *   get:
 *     summary: Project activity feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Activity entries
 *
 * /projects/{projectId}/features:
 *   get:
 *     summary: List features in project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Features
 *   post:
 *     summary: Create feature
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *
 * /features/{id}:
 *   get:
 *     summary: Get feature
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Feature detail
 *   patch:
 *     summary: Update feature
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete feature
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /bugs/{id}:
 *   get:
 *     summary: Get bug by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Bug detail
 *   patch:
 *     summary: Update bug fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete bug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /bugs/{id}/assign:
 *   patch:
 *     summary: Assign bug to user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Assigned
 *
 * /bugs/{id}/history:
 *   get:
 *     summary: Bug status history
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: History
 *
 * /bugs/{id}/timeline:
 *   get:
 *     summary: Bug timeline (comments, status, attachments)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Timeline
 *
 * /bugs/{bugId}/comments:
 *   get:
 *     summary: List comments on bug
 *     parameters:
 *       - in: path
 *         name: bugId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comments
 *   post:
 *     summary: Add comment
 *     parameters:
 *       - in: path
 *         name: bugId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *
 * /comments/{id}:
 *   patch:
 *     summary: Update comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /bugs/{bugId}/attachments:
 *   get:
 *     summary: List bug attachments
 *     parameters:
 *       - in: path
 *         name: bugId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attachments
 *   post:
 *     summary: Upload attachment (multipart file)
 *     parameters:
 *       - in: path
 *         name: bugId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Uploaded
 *
 * /attachments/{id}/download:
 *   get:
 *     summary: Download attachment file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File stream
 *
 * /attachments/{id}:
 *   delete:
 *     summary: Delete attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /projects/{projectId}/releases:
 *   get:
 *     summary: List releases
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Releases
 *   post:
 *     summary: Create release
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *
 * /releases/{id}:
 *   get:
 *     summary: Get release
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Release detail
 *
 * /releases/{id}/publish:
 *   patch:
 *     summary: Publish release
 *     description: Requires release:manage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Published
 *
 * /dashboard/charts:
 *   get:
 *     summary: Dashboard chart data
 *     responses:
 *       200:
 *         description: Charts
 *
 * /dashboard/my-work:
 *   get:
 *     summary: Bugs assigned to current user
 *     responses:
 *       200:
 *         description: My work items
 *
 * /reports/bugs-by-severity:
 *   get:
 *     summary: Bugs grouped by severity
 *     description: Requires reports:read
 *     responses:
 *       200:
 *         description: Report data
 *
 * /reports/bugs-by-assignee:
 *   get:
 *     summary: Bugs grouped by assignee
 *     description: Requires reports:read
 *     responses:
 *       200:
 *         description: Report data
 *
 * /reports/resolution-time:
 *   get:
 *     summary: Average resolution time
 *     description: Requires reports:read
 *     responses:
 *       200:
 *         description: Report data
 *
 * /reports/export:
 *   get:
 *     summary: Export bugs report
 *     description: Requires reports:read. Query type=json or type=csv
 *     responses:
 *       200:
 *         description: Export file or JSON
 *
 * /notifications:
 *   get:
 *     summary: List notifications for current user
 *     responses:
 *       200:
 *         description: Notifications
 *
 * /notifications/unread-count:
 *   get:
 *     summary: Unread notification count
 *     responses:
 *       200:
 *         description: Count
 *
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *
 * /notifications/read-all:
 *   post:
 *     summary: Mark all notifications read
 *     responses:
 *       200:
 *         description: Updated
 */
export {};
