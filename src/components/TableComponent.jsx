import React, { useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';
import { red } from '@mui/material/colors';


function TableComponent({ data }) {

    // console.log(data[0].percent_return_1_sigma_max_risk, 'data')
    // finding highest value
    const highestValueInReturnToMaxRatio = useMemo(() => {
        return data.reduce((max, item) => item.percent_return_1_sigma_max_risk > max ? item.percent_return_1_sigma_max_risk : max, -Infinity);
    }, [data])

    // color for ratio column
    const getColorClass = (percentage) => {
        if (percentage <= 10) return 'bg-red-300';
        if (percentage <= 50) return 'bg-yellow-300';
        return 'bg-green-300';
    };

    const columns = useMemo(() => [
        {
            accessorKey: "strike",
            header: "Strike",
            size: 50,
        },
        {
            id: "percent_in_out_money",
            accessorKey: "percent_in_out_money",
            header: "Percent in/out money",
            size: 50,
            filterVariant: 'multi-select',
            filterSelectOptions: [
                { text: 'In Money (> 0%)', value: 'in' },
                { text: 'Out of Money (< 0%)', value: 'out' },
            ],
            filterFn: (row, id, filterValues) => {
                if (!filterValues.length) return true;
                console.log(filterValues)
                const value = row.getValue(id);
                return filterValues.some(filter =>
                    (filter === 'in' && value > 0) || (filter === 'out' && value < 0)
                );
            },
            Cell: ({ cell }) => {
                const value = cell.getValue();
                const color = value < 0 ? 'bg-yellow-200' : 'bg-orange-300';
                return (
                    <div className={`text-amber-900 ${color} h-full w-full `}
                    >
                        {value.toFixed(2)}
                    </div>
                );
            },
        },
        {
            accessorKey: "percent_max_risk",
            header: "Percent max risk",
            size: 50
        },
        {
            accessorKey: "percent_cost_to_insure",
            header: "Percent cost to insure",
            size: 50
        },
        {
            accessorKey: "sigma_break_even",
            header: "Sigma break even",
            size: 50
        },
        {
            accessorKey: "percent_to_dbl",
            header: "Percent to dbl",
            size: 50
        },
        {
            accessorKey: "prob_above",
            header: "Prob above",
            size: 50
        },
        {
            accessorKey: "opt_mid_price",
            header: "Opt mid price",
            size: 50
        },
        {
            accessorKey: "percent_ask_time_value",
            header: "Percent ask time value",
            size: 50
        },
        {
            accessorKey: "delta",
            header: "Delta",
            size: 50
        },
        {
            accessorKey: "opt_open_int",
            header: "Opt open int",
            size: 50
        },
        {
            accessorKey: "black_scholes_ratio_siv",
            header: "Black scholes ratio siv",
            size: 50

        },
        {
            accessorKey: "black_scholes_ratio_50_day",
            header: "Black scholes ratio 50 day",
            size: 50
        },
        {
            accessorKey: "iv_hv",
            header: "Iv Hv",
            size: 50
        },
        {
            accessorKey: "percent_bid_ask_spread",
            header: "Percent bid ask spread",
            size: 50
        },
        {
            accessorKey: "percent_return_1_sigma_max_risk",
            header: "Percent return 1 sigma max risk",
            size: 200,
            Cell: ({ cell }) => {
                const value = cell.getValue();
                const percentage = (value / highestValueInReturnToMaxRatio) * 100;
                const colorClass = getColorClass(percentage);
                return (
                    <div className="relative w-full h-full">
                        <div
                            className={`absolute top-0 left-0 h-full ${colorClass}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative z-10 px-2 py-1 text-right text-black">
                            {value.toFixed(2)}
                        </div>
                    </div>
                );
            },
        },
    ], [data, highestValueInReturnToMaxRatio]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowNumbers: true,
        enableRowSelection: true,
        enableBottomToolbar: false,
        enablePagination: false,
        enableGlobalFilter: false,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },

        // defaultDisplayColumn: {
        //     minSize: 50
        // },
        // defaultColumn: {
        //     minSize: 40,
        //     maxSize: 60,
        //     size: 50
        // },
        muiTableContainerProps: {
            sx: { height: '100%', overflow: 'auto' }
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: '#191f31',
                color: 'white',
                '& .Mui-TableHeadCell-Content': {
                    color: 'white',
                },
                '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                },
            },

        },
        muiTableBodyCellProps: {
            sx: {
                border: "1px solid #e0e0e0",
                borderColor: 'grey.300',
                p: 1,

            },
        },

        muiTableBodyProps: {
            sx: {
                //stripe the rows, make odd rows a darker color
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
        muiTableHeadRowProps: {
            sx: {
                backgroundColor: '#191f31',
            },
        },
        muiColumnActionsButtonProps: {
            sx: {
                color: 'white'
            }
        },
        muiSearchTextFieldProps: {
            placeholder: 'Search all users',
            sx: { minWidth: '300px', },
            variant: 'outlined',
            color: 'white'
        },
    },
    )

    return (

        <MaterialReactTable table={table} />

    );
}

export default TableComponent;