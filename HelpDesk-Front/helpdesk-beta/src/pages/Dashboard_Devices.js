import React from 'react';
import DeviceTypesTable from '../components/Tables/DeviceTypeTable';
import DepartmentsTable from '../components/Tables/DepartmentsTable'
import DevicesTable from '../components/Tables/DeviceTable';

const DualTablePage = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50">
            <div>
                <DeviceTypesTable/>
            </div>
            <div>
                <DevicesTable/>
            </div>
        </div>
    );
};

export default DualTablePage;