/**
 * 前端路由配置，也是所有页面的入口。
 * 注意：require.ensure 实现代码按页面分割，动态加载，详细参考 webpack 文档
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import { createHistory } from 'history'
import env from './env'
import App from './App'

export default render((
  <Router onUpdate={() => window.scrollTo(0, 0)} history={createHistory()}>
    <Route path={env.basePath} component={App}>
      <IndexRoute getComponent={(location, cb) => {
        require.ensure([], require => {
            cb(null, require('./functions/Company').default)
          })
        }}>
      </IndexRoute>
      <Route path='overview' getComponent={(location, cb) => {
        require.ensure([], require => {
            cb(null, require('./functions/Overview/Index').default)
          })
        }}>
        <Route path="list/:id" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Overview/List').default)
          })
        }}/>
      </Route>
      <Route path="data" getComponent={(location, cb) => {
        require.ensure([], require => {
            cb(null, require('./functions/Data/Index').default)
          })
        }}>
        <Route path="moduleA" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/ModuleA').default)
          })
        }}/>
        <Route path="moduleB" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/ModuleB').default)
          })
        }}/>
      </Route>
      <Route path="system" getComponent={(location, cb) => {
        require.ensure([], require => {
            cb(null, require('./functions/System/Index').default)
          })
        }}>
        <Route path="dept" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/System/Dept').default)
          })
        }}/>
        <Route path="role" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/System/Role').default)
          })
        }}/>
        <Route path="user" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/System/User').default)
          })
        }}/>
      </Route>
      <Route path="login" getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('./functions/Login').default)
        })
      }}/>
      <Route path="*" getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('./functions/NotFound').default)
        })
      }}/>
    </Route>
  </Router>
), document.getElementById('app'))