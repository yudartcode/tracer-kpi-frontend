import { Button, DatePicker, Select } from 'antd'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Api } from './Api';
const { RangePicker } = DatePicker;

export default function TableFilter() {
  const [userGroups, setUserGroups] = useState()
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    userGroup: null,
    groupBy: null
  })
  const { Option } = Select;

  const handleDateChange = val => {
    setState({
      ...state,
      startDate: moment(val[0]).format('YYYY-MM-DD'),
      endDate: moment(val[1]).format('YYYY-MM-DD')
    })
  }
  async function getUserGroupData() {
    const res = await Api.getUserGroup()
    setUserGroups(res.data.userGroups)
  }
  const setFilterUserGroup = (e) => {
    setState({
      ...state,
      userGroup: e
    })
  }
  useEffect(()=>{
    getUserGroupData()
  },[])
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <span>Filter</span>
        <RangePicker
          onChange={handleDateChange}
          style={{ marginLeft: 10 }}
        />
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Pilih filter group user"
          onChange={setFilterUserGroup}
          optionLabelProp="label"
        >
          { userGroups && userGroups.map(u => (
              <Option key={u.id} value={u.id} label={u.displayName}>
                <div className="demo-option-label-item">
                {u.displayName}
                </div>
              </Option>
            ))}
        </Select>
        <Button key="1" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 34, border: 'solid 1px' }}> Tampilkan Data </Button>
      </div>
    )
}
