import React, { useEffect, useState } from 'react'
import { Layout, TreeSelect } from 'antd';
import { Api } from './views/Api';
import CasesTable from './views/CasesTable';

const { Header, Content, Footer } = Layout;
const currentDate = new Date();

const MainApp = () => {
    const [state, setState] = useState({
        ou: [
            {
                title: 'INDONESIA',
                value: 'AWDfATa8TT1',
            },
        ],
        value: 'AWDfATa8TT1'
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

        return parent;
    };

    async function getOu() {
        const res = await Api.getOrgUnit()
        const parent = res.data.organisationUnits.find((x) => x.id === 'AWDfATa8TT1')
        const ou = findChildrens({ id: 'AWDfATa8TT1'}, res.data)
        ou.title = parent.displayName
        ou.value = parent.id
        setState({
            ou: [ou],
            value: parent.id
        })
    }

    const onChange = value => {
        setState({...state, value})
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
                    value={state.value}
                    treeData={state.ou}
                    style={{ width: 300 }}
                    onChange={onChange}
                    />
            </Header>
            <Content>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 500 }}>
                    <div style={{ backgroundColor: "#FFFFFF" }}>
                        <CasesTable orgUnit={state.value}/>
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Lacak Covid {currentDate.getFullYear()}</Footer>
        </Layout>
    )
}

export default MainApp;