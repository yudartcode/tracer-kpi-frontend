import React from 'react'
import CasesTable from './CasesTable';

export default function Dashboard(props) {
    return (
        <div style={{ backgroundColor: "#FFFFFF" }}>
            <CasesTable orgUnit={props.orgUnit}/>
        </div>
    )
}
