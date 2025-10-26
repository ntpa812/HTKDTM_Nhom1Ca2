// smart-lms-frontend/src/components/layout/sidebarConfig.js
export const studentMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
    { key: 'courses', label: 'Courses', icon: '📚', to: '/courses' },
    {
        key: 'learning',
        label: 'Learning',
        icon: '🎓',
        children: [
            { key: 'lp-list', label: 'Learning Paths', to: '/learning' },
            { key: 'my-paths', label: 'My Paths', to: '/my-learning-paths' },
        ]
    },
    { key: 'analytics', label: 'Analytics', icon: '📈', to: '/analytics' },
    { key: 'certificates', label: 'Certificates', icon: '🏆', to: '/certificates' },
    { key: 'profile', label: 'Profile', icon: '👤', to: '/profile' },
    { key: 'support', label: 'Support', icon: '🛟', to: '/support' }
];

export const instructorMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
    {
        key: 'courses',
        label: 'Courses',
        icon: '📚',
        children: [
            { key: 'my-courses', label: 'My Courses', to: '/instructor/courses' },
            { key: 'create-course', label: 'Create Course', to: '/instructor/courses/create' }
        ]
    },
    {
        key: 'learning',
        label: 'Learning',
        icon: '🎓',
        children: [
            { key: 'my-paths', label: 'My Learning Paths', to: '/instructor/learning-paths' },
            { key: 'create-path', label: 'Create Learning Path', to: '/create-path' }
        ]
    },
    {
        key: 'students',
        label: 'Students',
        icon: '🧑‍🎓',
        children: [
            { key: 'enrollments', label: 'Enrollments', to: '/instructor/enrollments' },
            { key: 'performance', label: 'Performance', to: '/instructor/performance' }
        ]
    },
    {
        key: 'analytics',
        label: 'Analytics',
        icon: '📈',
        children: [
            { key: 'path-analytics', label: 'Path Analytics', to: '/instructor/analytics/paths' },
            { key: 'course-analytics', label: 'Course Analytics', to: '/instructor/analytics/courses' },
        ]
    },
    { key: 'profile', label: 'Profile', icon: '👤', to: '/profile' },
    { key: 'support', label: 'Support', icon: '🛟', to: '/support' }
];
