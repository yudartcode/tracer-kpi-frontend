import { PageHeader, DatePicker, Radio, Table, Select, Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Api } from './Api';
import ReactExport from "react-data-export";
import { FileExcelOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function CasesTable(props) {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const [loading, setLoading] = useState(false)
    const [groupBy, setGroupBy] = useState('storedBy')
    const [state, setState] = useState({
      data: null
    })
    const [faskes, setFaskes] = useState()
    const [userGroups, setUserGroups] = useState()
    const [filter, setFilter] = useState({
      programUID: 'QqodHvGgDrq',
      startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      groupBy: null,
      orgUID: props.orgUnit,
      userGroup: '{"all"}',
    })
    const { Option } = Select;

    const handleDateChange = val => {
      setFilter({
        ...filter,
        startDate: moment(val[0]).format('YYYY-MM-DD'),
        endDate: moment(val[1]).format('YYYY-MM-DD')
      })
    }
    async function getUserGroupData() {
      const res = await Api.getUserGroup()
      setUserGroups(res.data.userGroups)
    }
    const setFilterUserGroup = (e) => {
      setFilter({
        ...filter,
        userGroup: `{"${e.join('","')}"}`
      })
    }
    async function getData() {
      setLoading(true)
      filter.userGroup = filter.userGroup === '{""}' ? '{"all"}' : filter.userGroup
      await Api.getKpi(filter).then((res) => {
        setState({data: res.data})
        setLoading(false)
      })
    }
    const groupOptions = [
      {value: 'storedBy', label:'Petugas'},
      {value: 'orgUnitName', label:'Fasilitas Kesehatan'},
    ]
    function toFaskes() {
      const faskes = []
      const data = state.data.concat()
      data.map(e => {
        const f = faskes.find(x => x.orgl5 === e.orgl5)
        if (f===null||f===undefined) {
          faskes.push(e)
        } else {
          const u = faskes.indexOf(f)
          f.total+=e.total
          f.totalcompleted+=e.totalcompleted
          faskes[u]=f
        }
      });
      setFaskes(faskes)
    }
    const onChangeGroupBy = (e) => {
      setGroupBy(e.target.value)
      if (e.target.value === 'orgUnitName') {
        toFaskes()
      }
    }
    const Download = () => {
      if (groupBy==='storedBy') {
        return (
          <ExcelFile element={<Button icon={<FileExcelOutlined />}>Download Excel</Button>}>
            <ExcelSheet data={state.data} name="Trace">
              <ExcelColumn label="Nama Petugas" value="firstname" />
              <ExcelColumn label="Username" value="username" />
              <ExcelColumn label="Puskesmas" value="orgl5" />
              <ExcelColumn label="Kecamatan" value="orgl4" />
              <ExcelColumn label="Kabupaten" value="orgl3" />
              <ExcelColumn label="Provinsi" value="orgl2" />
              <ExcelColumn label="Kelompok Pengguna" value={(col) => col.group.join(', ')} />
              <ExcelColumn label="Total KE" value="total" />
              <ExcelColumn label="Total KE Selesai Pemantauan" value="totalcompleted" />
            </ExcelSheet>
          </ExcelFile>
        )
      } else {
        return (
          <ExcelFile element={<Button icon={<FileExcelOutlined />}>Download Excel</Button>}>
            <ExcelSheet data={faskes} name="Trace">
              <ExcelColumn label="Puskesmas" value="orgl5" />
              <ExcelColumn label="Kecamatan" value="orgl4" />
              <ExcelColumn label="Kabupaten" value="orgl3" />
              <ExcelColumn label="Provinsi" value="orgl2" />
              <ExcelColumn label="Total KE" value="total" />
              <ExcelColumn label="Total KE Selesai Pemantauan" value="totalcompleted" />
            </ExcelSheet>
          </ExcelFile>
        )
      }
    }
          
    const columns = [
      {
        title: "Nama Petugas",
        dataIndex: "firstname",
        key: "firstname",
      },
      {
        title: "Username",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "Puskesmas",
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
        title: "Kelompok Pengguna",
        dataIndex: "group",
        key: "group",
        render: (text) => text.join(', ')
      },
      {
        title: "Total KE",
        dataIndex: "total",
        key: "total",
        align: 'right',
      },
      {
        title: "Total KE Selesai Pemantauan",
        dataIndex: "totalcompleted",
        key: "totalcompleted",
        align: 'right',
      },
    ];
    const columnsFaskes = [
      {
        title: "Puskesmas",
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
        title: "Total KE",
        dataIndex: "total",
        key: "total",
        align: 'right',
      },
      {
        title: "Total KE Selesai Pemantauan",
        dataIndex: "totalcompleted",
        key: "totalcompleted",
        align: 'right',
      },
    ];
    const onClick = () => {
      getData()
    }
    useEffect(() => {
      getUserGroupData()
      getData()
    }, [groupBy])
    useEffect(() => {
        setFilter({
            ...filter,
            orgUID: props.orgUnit
        })
    }, [props])
    return (
        <div style={{ padding: 20 }}>
          <PageHeader
                title="Tracer KPI"
                ghost={false}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <span>Filter</span>
                <RangePicker
                  onChange={handleDateChange}
                  style={{ marginLeft: 10 }}
                  defaultValue={[moment().subtract(14, 'days'), moment()]}
                />
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Pilih filter group user"
                  onChange={setFilterUserGroup}
                  optionLabelProp="label"
                >
                  { userGroups && userGroups.map(u => (
                      <Option key={u.id} value={u.displayName} label={u.displayName}>
                        <div className="demo-option-label-item">
                        {u.displayName}
                        </div>
                      </Option>
                    ))}
                </Select>
                <Button key="1" onClick={onClick} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 34, border: 'solid 1px' }}> Tampilkan Data </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', flex: 1, paddingTop: 20}}>
                <div>
                    <span style={{marginRight:10}}>Group by:</span> 
                    <Radio.Group options={groupOptions} 
                    onChange={onChangeGroupBy} 
                    value={groupBy} 
                    optionType="button"
                    buttonStyle="solid"
                    />
                </div>
                <div style={{marginLeft:'auto'}}><Download /></div>
            </div>
            </PageHeader>
            
            <Table
            loading={loading}
            dataSource={groupBy==='orgUnitName' ? faskes : state.data}
            columns={groupBy==='orgUnitName' ? columnsFaskes : columns}
            rowKey="no"
            pagination={{ position: ["topRight", "bottomRight"] }}
          />
        </div>
    )
}
