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
          cb(null, require('./functions/DataDev').default)
        })
      }}/>
        <Route path="DataDev"  getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataDev').default)
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataDev/TaskDev').default)
            })
          }}/>
          <Route path="TaskDev" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataDev/TaskDev').default)
            })
          }}/>
          <Route path="Adhoc" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataDev/Adhoc').default)
          })
        }}/>
          <Route path="FunManage" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataDev/FunManage').default)
          })
        }}/>
          <Route path="ResManage" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataDev/ResManage').default)
            })
          }}/>
          <Route path="DataSet" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataDev/DataSet').default)
            })
          }}/>
        </Route>
        <Route path="OmCenter" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/OmCenter').default)
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/OmCenter/OMSettings').default)
            })
          }}/>
          <Route path="OMSettings" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/OmCenter/OMSettings').default)
            })
          }}/>
          <Route path="OMTask" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/OmCenter/OMTask').default)
          })
        }}/>
        </Route>
      <Route path="SysManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/SysManager').default)
          })
        }}>
        <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/SysManager/QueueManager').default)
            })
          }}/>
        <Route path="QueueSettings" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/SysManager/QueueSettings').default)
            })
          }}/>
        <Route path="QueueManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/SysManager/QueueManager').default)
          })
        }}/>
      </Route>
        <Route path="DataManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataManager').default)
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataManager/DataOverview').default)
            })
          }}/>
          <Route path="DataOverview" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataManager/DataOverview').default)
            })
          }}/>
          <Route path="CreateTable" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataManager/CreateTable').default)
          })
        }}/>
          <Route path="PermManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataManager/PermManager').default)
          })
        }}/>
          <Route path="ModifyTable" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/DataManager/ModifyTable').default)
            })
          }}/>
          <Route path="ClassManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/DataManager/ClassManager').default)
          })
        }}/>
        </Route>

        <Route path="ProjectManage" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/ProjectManage').default)
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/ProjectManage/MyProject').default)
            })
          }}/>
          <Route path="MyProject" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/ProjectManage/MyProject').default)
            })
          }}/>
          <Route path="ProjectList" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/ProjectManage/ProjectList').default)
            })
          }}/>
        </Route>

        <Router path="OrgManager" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/OrgManager').default)
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/OrgManager/MyOrg').default)
            })
          }}/>
          <Route path="MyOrg" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/OrgManager/MyOrg').default)
            })
          }}>
            <Route path="BuildOrg" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/OrgManager/MyOrg/BuildOrg').default)
              })
            }}/>
            <Route path="JoinOrg" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/OrgManager/MyOrg/JoinOrg').default)
              })
            }}/>
          </Route>
          <Route path="Authority" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/OrgManager/Authority').default)
            })
          }}/>
          <Route path="Authentication" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/OrgManager/Authentication').default)
          })
        }}/>
          <Route path="AssignPermissions" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/OrgManager/AssignPermissions').default)
          })
        }}/>
        </Router>

      <Route path="Home" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Home').default)
          })
        }}/>

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