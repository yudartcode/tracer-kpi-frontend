import React, { useEffect, useState } from 'react'
import { Layout, Menu, TreeSelect } from 'antd';
import Dashboard from './views/Dashboard';
import OrganizationUnitSelector from './views/OrganizationUnitSelector';
import { Api } from './views/Api';

const { Header, Content, Footer } = Layout;
const currentDate = new Date();

const MainApp = () => {
    const [state, setState] = useState({
        ou: [
            {
                title: 'Node1',
                value: '0-0',
                children: [
                    {
                        title: 'Child Node1',
                        value: '0-0-1',
                    },
                    {
                        title: 'Child Node2',
                        value: '0-0-2',
                    },
                ],
            },
            {
                title: 'Node2',
                value: '0-1',
            },
        ]
    })

    const findChildrens = (parent, ou) => {
        if (!parent) return [];
        let children = ou.organisationUnits.reduce((result, unit) => {
            if (unit.parent && unit.parent.id === parent.id) {
                unit.title = unit.displayName;
                unit.value = unit.id;
                result.push(unit);
            }
            return result;
        }, []);
        if (children != null && children.length > 0) {
            children = children.map(child => {
            return findChildrens(child, ou);
        });
        }
        if (children.length > 0) {
            parent.children = children;
        }

        // console.log(parent);

        return parent;
    };

    async function getOu() {
        const res = await Api.getOrgUnit()
        console.log(res.data);
        // setState({
        //     ...state, 
        //     ou: findChildrens({ id: 'AWDfATa8TT1'}, res.data)
        // })
    }

    useEffect(() => {
        getOu()
    }, [])

    return (
        <Layout>
            <Header>
                <TreeSelect
                    showSearch={true}
                    allowClear={true}
                    treeDefaultExpandAll={false}
                    // value={ou.selectedOrganisationUnit}
                    treeData={state.ou}
                    style={{ width: 300 }}
                    />
            </Header>
            <Content>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 500 }}>
                    <Dashboard />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Lacak Covid {currentDate.getFullYear()}</Footer>
        </Layout>
    )
}

export default MainApp;