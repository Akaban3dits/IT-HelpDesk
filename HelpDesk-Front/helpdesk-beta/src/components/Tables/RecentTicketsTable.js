import React from 'react';
import Table from '../ui/Table';

const RecentTicketsTable = ({ tickets }) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>Title</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Priority</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {tickets.map((ticket) => (
                    <Table.Row key={ticket.id}>
                        <Table.Cell>{ticket.id}</Table.Cell>
                        <Table.Cell>{ticket.title}</Table.Cell>
                        <Table.Cell>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'}`}>
                                {ticket.status}
                            </span>
                        </Table.Cell>
                        <Table.Cell>{ticket.priority}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default RecentTicketsTable;
