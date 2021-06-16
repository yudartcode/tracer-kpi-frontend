import React,{useState} from "react";
import { Layout, Menu, Breadcrumb, Button, TreeSelect } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";

const OrganizationUnitSelector = observer(() => {
  const { ou } = useStore();
  const onChange = (value, names, e) => {
    ou.select(value);
  };

  return (
    <TreeSelect
      showSearch={true}
      allowClear={true}
      treeDefaultExpandAll={false}
      value={ou.selectedOrganisationUnit}
      treeData={ou.menus}
      onChange={onChange}
      style={{ width: 300 }}
    ></TreeSelect>
  );
});

export default OrganizationUnitSelector;
