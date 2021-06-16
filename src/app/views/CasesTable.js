import { Radio, Table } from 'antd';
import React, { useState } from 'react'

export default function CasesTable() {
    const [groupBy, setGroupBy] = useState('storedBy')
    const groupOptions = [
        {value: 'storedBy', label:'Petugas'},
        {value: 'orgUnitName', label:'Fasilitas Kesehatan'},
    ]
    const onChangeGroupBy = (e) => {
        setGroupBy(e.target.value)
    }
    const columns = [
    {
      title: "Petugas",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "PKM",
      dataIndex: "orgl5",
      key: "orgl5",
    },
    {
      title: "Kecamatan",
      dataIndex: "orgl4",
      key: "orgl4",
    },
    {
      title: "Kabupaten",
      dataIndex: "orgl3",
      key: "orgl3",
    },
    {
      title: "Provinsi",
      dataIndex: "orgl2",
      key: "orgl2",
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      align: 'right',
    },
  ];
    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1}}>
                <div>
                    <span style={{marginRight:10}}>Group by:</span> 
                    <Radio.Group options={groupOptions} 
                    onChange={onChangeGroupBy} 
                    value={groupBy} 
                    optionType="button"
                    buttonStyle="solid"
                    />
                </div>
                {/* <div style={{marginLeft:'auto'}}><Download /></div> */}
            </div>
            <Table
            dataSource={null}
            columns={columns}
            rowKey="no"
            pagination={{ position: ["topRight", "bottomRight"] }}
          />
        </div>
    )
}
