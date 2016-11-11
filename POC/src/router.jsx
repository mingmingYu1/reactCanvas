/**
 * 前端路由配置，也是所有页面的入口。
 * 注意：require.ensure 实现代码按页面分割，动态加载，详细参考 webpack 文档
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Redirect} from 'react-router'
import { createHistory } from 'history'
import env from './env'
import App from './App'

export default render((
  <Router onUpdate={() => window.scrollTo(0, 0)} history={createHistory()}>
    <Route path={env.basePath} component={App}>   
      <IndexRoute getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/Dashboard').default)
          })
        }}/>   
      <Route path="data">
        <Route path="details" getComponent={(location, cb) =>{
          require.ensure([], require => {
            cb(null, require('./functions/Data/Details').default)
          })
        }}/>
        <Route path="performance" getComponent={(location, cb) =>{
          require.ensure([], require => {
            cb(null, require('./functions/Data/Performance').default)
          })
        }}/>
        <Route path="dashboard" getComponent={(location, cb) => {  
          require.ensure([], require => {
            cb(null, require('./functions/Data/Dashboard').default)
          })
        }}/>
        <Route path="synopsis" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/Synopsis').default)
          })
        }}/>         
        <Route path="performance" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/Performance').default)      
          })
        }}/>  
        <Route path="department" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/Department').default)      
          })
        }}/> 
        <Redirect from="/data/mycenter" to="/data/mycenter/board/Contribution"/>        
        <Route path="mycenter">                      
          <Route path="board" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/MyCenter').default)      
            })
          }}>
            <IndexRoute getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Contribution').default)
              })
            }}/>
            <Route path="contribution" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Contribution').default)      
              })
            }}/> 
            <Route path="collection" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Collection').default)      
              })
            }}/>  
            <Route path="down" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Down').default)      
              })
            }}/>              
            <Route path="share" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Share').default)      
              })
            }}/> 
            <Route path="shareWithMe" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/ShareWithMe').default)      
              })
            }}/> 
            <Route path="help" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/Help').default)      
              })
            }}/> 
            <Route path="personalInfo" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/PersonalInfo').default)      
              })
            }}/> 
            <Route path="changePwd" getComponent={(location, cb) => {
              require.ensure([], require => {
                cb(null, require('./functions/Data/MyCenter/ChangePwd').default)      
              })
            }}/> 
          </Route>
          <Route path="upload" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/MyCenter/Upload').default)      
            })
          }}/> 
          <Route path="feedback" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/MyCenter/Feedback').default)      
            })
          }}/>
          <Route path="seekDoc" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/MyCenter/SeekDoc').default)      
            })
          }}/>
        </Route>
        <Redirect from="/data/manage" to="/data/manage/organizemanage"/>
        <Route path="manage" getComponent={(location, cb) => {
          require.ensure([], require => {
            cb(null, require('./functions/Data/Manage').default)      
          })
        }}>
          <IndexRoute getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/OrganizeManage').default)
            })
          }}/>
          <Route path="organizemanage" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/OrganizeManage').default)      
            })
          }}/>
          <Route path="usermanage" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/usermanage').default)
            })
          }} />
          <Route path="postmanage" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/PostManage').default)
            })
          }} />
          <Route path="departmanage" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/DepartManage').default)
            })
          }} />
          <Route path="userfeedback" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/Userfeedback').default)
            })
          }} />
          <Route path="operationlog" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/OperationLog').default)
            })
          }} />
          <Route path="interfacelog" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/InterfaceLog').default)
            })
          }} />
          <Route path="latestnotice" getComponent={(location, cb) => {
            require.ensure([], require => {
              cb(null, require('./functions/Data/Manage/LatestNotice').default)
            })
          }} />
        </Route> 
      </Route>
      <Route path="login" getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('./functions/Login').default)
        })
      }}/>       
    </Route>
  </Router>
), document.getElementById('app'))