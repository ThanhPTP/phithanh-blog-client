import { defineConfig } from "@umijs/max";
const { APPLICATION_API } = process.env;

export default defineConfig({
  antd: {
    configProvider: {}
  },
  access: {},
  model: {},
  initialState: {},
  favicons: ['/favicon.ico'],
  request: {},
  layout: {
    title: 'CMS Admin',
  },
  locale: {
    default: 'vi-VN',
    antd: true,
    baseNavigator: false,
    title: false
  },
  define: {
    APPLICATION_API,
  },
  routes: [
    {
      path: "/",
      redirect: "/cms",
    },
    {
      exact: true,
      path: '/login',
      component: './Login',
      hideInMenu: true,
      layout: false
    },
    {
      name: 'cms',
      path: '/cms',
      icon: 'hdd',
      routes: [
        {
          path: '/cms',
          redirect: 'posts',
        },
        {
          exact: true,
          name: 'posts',
          path: '/cms/posts',
          routes: [
            {
              path: '/cms/posts',
              redirect: 'list',
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'list',
              path: '/cms/posts/list',
              component: './CMS/Post'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'edit',
              path: '/cms/posts/edit/:id',
              component: './CMS/Post/form'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'create',
              path: '/cms/posts/create',
              component: './CMS/Post/form'
            }
          ]
        },
        {
          exact: true,
          name: 'categories',
          path: '/cms/categories',
          routes: [
            {
              path: '/cms/categories',
              redirect: 'list',
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'list',
              path: '/cms/categories/list',
              component: './CMS/Category'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'edit',
              path: '/cms/categories/edit/:id',
              component: './CMS/Category/form'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'create',
              path: '/cms/categories/create',
              component: './CMS/Category/form'
            }
          ]
        },
        {
          exact: true,
          name: 'tags',
          path: '/cms/tags',
          routes: [
            {
              path: '/cms/tags',
              redirect: 'list',
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'list',
              path: '/cms/tags/list',
              component: './CMS/Tag'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'edit',
              path: '/cms/tags/edit/:id',
              component: './CMS/Tag/form'
            },
            {
              exact: true,
              hideInMenu: true,
              name: 'create',
              path: '/cms/tags/create',
              component: './CMS/Tag/form'
            }
          ]
        }
      ]
    }
  ],
  npmClient: "yarn",
  tailwindcss: {},
});
