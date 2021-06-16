import { Button, DatePicker, Select } from 'antd'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Api } from './Api';
const { RangePicker } = DatePicker;

export default function TableFilter() {
  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const [userGroupFilter, setUserGroupFilter] = useState([]);
  const [filter, setFilter] = useState({ date: [moment().startOf('month'), moment().endOf('month')], text: null });
  const [userGroups, setUserGroups] = useState();
  const { Option } = Select;
  const disabledDate = current => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const onOpenChange = open => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  const onChange = e => {
    const newFilter = { ...filter, text: e.target.value }
    setFilter(newFilter)
  };
  const handleDateChange = val => {
    const newFilter = { ...filter, date: [moment(val[0]), moment(val[1])] }
    setFilter(newFilter)
    setValue(val)
  }
  const handleDateOk = val => {
  }
  const onLoadData = () => {
  };
  async function getUserGroupData() {
    const res = await Api.getUserGroup()
    setUserGroups(res.data.userGroups)
  }
  const setFilterUserGroup = (e) => {
    console.log(e)
    const newFilter = {...filter, userGroups: e}
    setFilter(newFilter)
  }
  useEffect(()=>{
    getUserGroupData()
  },[])
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <span>Filter</span>
      <RangePicker
        value={hackValue || value}
        disabledDate={disabledDate}
        onCalendarChange={val => setDates(val)}
        onChange={handleDateChange}
        onOpenChange={onOpenChange}
        onOk={handleDateOk}
        style={{ marginLeft: 10 }}
      />
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Pilih filter group user"
        defaultValue={userGroupFilter}
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
      <Button key="1" onClick={onLoadData} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 34, border: 'solid 1px' }}> Tampilkan Data </Button>
    </div>
    )
}
