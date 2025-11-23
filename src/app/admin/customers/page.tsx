import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import CustomerTable from '@/components/dashboard/CustomerTable';

export default function CustomersPage() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customers</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard label="Total Customers" value={8468} growth="+20%" />
            </div>
            <CustomerTable />
        </div>
    );
}
