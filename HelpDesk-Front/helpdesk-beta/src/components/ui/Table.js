const Table = ({ children }) => {
    return (
        <table className="min-w-full bg-white border">
            {children}
        </table>
    );
};

const Header = ({ children }) => (
    <thead className="bg-gray-200 border-b">
        {children}
    </thead>
);

const Body = ({ children }) => (
    <tbody className="divide-y divide-gray-200">
        {children}
    </tbody>
);

const Row = ({ children }) => <tr>{children}</tr>;

const Head = ({ children, onClick }) => (
    <th onClick={onClick} className="px-4 py-2 text-left cursor-pointer">
        {children}
    </th>
);

const Cell = ({ children }) => (
    <td className="px-4 py-2">
        {children}
    </td>
);

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;

export default Table;
