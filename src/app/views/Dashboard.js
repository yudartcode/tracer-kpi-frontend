import React from 'react'
import { PageHeader } from 'antd';
import TableFilter from './TableFilter';
import CasesTable from './CasesTable';

export default function Dashboard() {
    return (
        <div style={{ backgroundColor: "#FFFFFF" }}>
            <PageHeader
                title="Tracer KPI"
                ghost={false}
            >
                <TableFilter />
            </PageHeader>
            <CasesTable />
        </div>
    )
}
