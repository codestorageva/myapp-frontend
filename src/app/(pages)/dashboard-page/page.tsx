'use client'
import { Suspense } from 'react';
import Layout from '@/app/component/layout'
import React, { useEffect, useState } from 'react'
import { getCompanyById } from './dashboard';
import { useSearchParams } from 'next/navigation';
import { CompanyData } from '../../organization/main-dashboard/company-list';
import Spinner from '@/app/component/spinner';
import Loader from '@/app/component/Loader/page';
// import { AreaChart, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, Tooltip, Legend, Cell, ResponsiveContainer, YAxis, LabelList } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlarmClock, Clock, FileWarning, Package, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import styles from './barchartcss.module.scss';

const DashboardScreen = () => {
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId') ?? '';
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const description = 'A multiple bar chart'

    const chartData = [
        { date: "2024-04-01", income: 500, expense: 320 },
        { date: '2024-04-02', income: 620, expense: 410 },
        { date: '2024-04-03', income: 480, expense: 390 },
        { date: '2024-04-04', income: 700, expense: 450 },
        { date: '2024-04-05', income: 800, expense: 560 },
        { date: '2024-04-06', income: 750, expense: 520 },
        { date: '2024-04-07', income: 500, expense: 320 },
        { date: '2024-04-08', income: 620, expense: 410 },
        { date: '2024-04-09', income: 480, expense: 390 },
        { date: '2024-04-10', income: 700, expense: 450 },
        { date: '2024-04-11', income: 800, expense: 560 },
        { date: '2024-04-12', income: 750, expense: 520 },
        { date: "2024-04-13", income: 342, expense: 380 },
        { date: "2024-04-14", income: 137, expense: 220 },
        { date: "2024-04-15", income: 120, expense: 170 },
        { date: "2024-04-16", income: 138, expense: 190 },
        { date: "2024-04-17", income: 446, expense: 360 },
        { date: "2024-04-18", income: 364, expense: 410 },
        { date: "2024-04-19", income: 243, expense: 180 },
        { date: "2024-04-20", income: 89, expense: 150 },
        { date: "2024-04-21", income: 137, expense: 200 },
        { date: "2024-04-22", income: 224, expense: 170 },
        { date: "2024-04-23", income: 138, expense: 230 },
        { date: "2024-04-24", income: 387, expense: 290 },
        { date: "2024-04-25", income: 215, expense: 250 },
        { date: "2024-04-26", income: 75, expense: 130 },
        { date: "2024-04-27", income: 383, expense: 420 },
        { date: "2024-04-28", income: 122, expense: 180 },
        { date: "2024-04-29", income: 315, expense: 240 },
        { date: "2024-04-30", income: 454, expense: 380 },
    ];

    const [activeChart, setActiveChart] = React.useState<ChartType>("both");
    type ChartType = "income" | "expense" | "both";

    const barChartConfig = {
        income: {
            label: "Income",
            color: "#86efac",
        },
        expense: {
            label: "Expense",
            color: "#f87171",
        },
    }

    const areachartData = [
        { date: "2024-04-01", income: 222, expense: 150 },
        { date: "2024-04-02", income: 97, expense: 180 },
        { date: "2024-04-03", income: 167, expense: 120 },
        { date: "2024-04-04", income: 242, expense: 260 },
        { date: "2024-04-05", income: 373, expense: 290 },
        { date: "2024-04-06", income: 301, expense: 340 },
        { date: "2024-04-07", income: 245, expense: 180 },
        { date: "2024-04-08", income: 409, expense: 320 },
        { date: "2024-04-09", income: 59, expense: 110 },
        { date: "2024-04-10", income: 261, expense: 190 },
        { date: "2024-04-11", income: 327, expense: 350 },
        { date: "2024-04-12", income: 292, expense: 210 },
        { date: "2024-04-13", income: 342, expense: 380 },
        { date: "2024-04-14", income: 137, expense: 220 },
        { date: "2024-04-15", income: 120, expense: 170 },
        { date: "2024-04-16", income: 138, expense: 190 },
        { date: "2024-04-17", income: 446, expense: 360 },
        { date: "2024-04-18", income: 364, expense: 410 },
        { date: "2024-04-19", income: 243, expense: 180 },
        { date: "2024-04-20", income: 89, expense: 150 },
        { date: "2024-04-21", income: 137, expense: 200 },
        { date: "2024-04-22", income: 224, expense: 170 },
        { date: "2024-04-23", income: 138, expense: 230 },
        { date: "2024-04-24", income: 387, expense: 290 },
        { date: "2024-04-25", income: 215, expense: 250 },
        { date: "2024-04-26", income: 75, expense: 130 },
        { date: "2024-04-27", income: 383, expense: 420 },
        { date: "2024-04-28", income: 122, expense: 180 },
        { date: "2024-04-29", income: 315, expense: 240 },
        { date: "2024-04-30", income: 454, expense: 380 },
        { date: "2024-05-01", income: 165, expense: 220 },
        { date: "2024-05-02", income: 293, expense: 310 },
        { date: "2024-05-03", income: 247, expense: 190 },
        { date: "2024-05-04", income: 385, expense: 420 },
        { date: "2024-05-05", income: 481, expense: 390 },
        { date: "2024-05-06", income: 498, expense: 520 },
        { date: "2024-05-07", income: 388, expense: 300 },
        { date: "2024-05-08", income: 149, expense: 210 },
        { date: "2024-05-09", income: 227, expense: 180 },
        { date: "2024-05-10", income: 293, expense: 330 },
        { date: "2024-05-11", income: 335, expense: 270 },
        { date: "2024-05-12", income: 197, expense: 240 },
        { date: "2024-05-13", income: 197, expense: 160 },
        { date: "2024-05-14", income: 448, expense: 490 },
        { date: "2024-05-15", income: 473, expense: 380 },
        { date: "2024-05-16", income: 338, expense: 400 },
        { date: "2024-05-17", income: 499, expense: 420 },
        { date: "2024-05-18", income: 315, expense: 350 },
        { date: "2024-05-19", income: 235, expense: 180 },
        { date: "2024-05-20", income: 177, expense: 230 },
        { date: "2024-05-21", income: 82, expense: 140 },
        { date: "2024-05-22", income: 81, expense: 120 },
        { date: "2024-05-23", income: 252, expense: 290 },
        { date: "2024-05-24", income: 294, expense: 220 },
        { date: "2024-05-25", income: 201, expense: 250 },
        { date: "2024-05-26", income: 213, expense: 170 },
        { date: "2024-05-27", income: 420, expense: 460 },
        { date: "2024-05-28", income: 233, expense: 190 },
        { date: "2024-05-29", income: 78, expense: 130 },
        { date: "2024-05-30", income: 340, expense: 280 },
        { date: "2024-05-31", income: 178, expense: 230 },
        { date: "2024-06-01", income: 178, expense: 200 },
        { date: "2024-06-02", income: 470, expense: 410 },
        { date: "2024-06-03", income: 103, expense: 160 },
        { date: "2024-06-04", income: 439, expense: 380 },
        { date: "2024-06-05", income: 88, expense: 140 },
        { date: "2024-06-06", income: 294, expense: 250 },
        { date: "2024-06-07", income: 323, expense: 370 },
        { date: "2024-06-08", income: 385, expense: 320 },
        { date: "2024-06-09", income: 438, expense: 480 },
        { date: "2024-06-10", income: 155, expense: 200 },
        { date: "2024-06-11", income: 92, expense: 150 },
        { date: "2024-06-12", income: 492, expense: 420 },
        { date: "2024-06-13", income: 81, expense: 130 },
        { date: "2024-06-14", income: 426, expense: 380 },
        { date: "2024-06-15", income: 307, expense: 350 },
        { date: "2024-06-16", income: 371, expense: 310 },
        { date: "2024-06-17", income: 475, expense: 520 },
        { date: "2024-06-18", income: 107, expense: 170 },
        { date: "2024-06-19", income: 341, expense: 290 },
        { date: "2024-06-20", income: 408, expense: 450 },
        { date: "2024-06-21", income: 169, expense: 210 },
        { date: "2024-06-22", income: 317, expense: 270 },
        { date: "2024-06-23", income: 480, expense: 530 },
        { date: "2024-06-24", income: 132, expense: 180 },
        { date: "2024-06-25", income: 141, expense: 190 },
        { date: "2024-06-26", income: 434, expense: 380 },
        { date: "2024-06-27", income: 448, expense: 490 },
        { date: "2024-06-28", income: 149, expense: 200 },
        { date: "2024-06-29", income: 103, expense: 160 },
        { date: "2024-06-30", income: 446, expense: 400 },
    ]

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        income: {
            label: "Sale",
            color: "#16a34a",
        },
        expense: {
            label: "Purchase",
            color: "#dc2626",
            // color: '#f87171'
        },
    } satisfies ChartConfig

    const piechartData = [

        { browser: "product", visitors: 200, fill: "var(--color-product)" },
        { browser: "credit", visitors: 300, fill: "var(--color-credit)" },
        { browser: "mobile", visitors: 250, fill: "var(--color-mobile)" },
        { browser: "advertising", visitors: 50, fill: "var(--color-advertising)" },
        { browser: "lodging", visitors: 200, fill: "var(--color-lodging)" },
        { browser: "income", visitors: 800, fill: "var(--color-income)" },
    ]
    const piechartConfig = {
        visitors: {
            label: "Visitors",
        },
        income: {
            label: 'Income',
            color: '#16a34a'
        },
        product: {
            label: "Product",
            color: "var(--chart-1)",
        },
        credit: {
            label: "Credit Card Charges",
            color: "var(--chart-2)",
        },
        mobile: {
            label: "Automobile Expense",
            color: "var(--chart-3)",
        },
        advertising: {
            label: "Advertising And Marketing",
            color: "var(--chart-4)",
        },
        lodging: {
            label: "Lodging",
            color: "var(--chart-5)",
        },
    } satisfies ChartConfig

    const ChartConfig = {
        income: {
            label: 'Income',
            color: '#03508C'
        },
        expense: {
            label: "Expense",
            color: "#0874CB",
        }
    } satisfies ChartConfig

    const [timeRange, setTimeRange] = React.useState("90d")

    const [barChartRange, setBarChartRange] = useState('30d')

    const filteredData = areachartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    const barChartFilterData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date('2024-04-30')
        let daysToSubtract = 30
        if (barChartRange === '7d') {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    const renderLabel = ({ percent }: any) =>
        `${(percent * 100).toFixed(0)}%`;

    const totalSales = areachartData.reduce((acc, cur) => acc + (cur.income ?? 0), 0);
    const totalReceipts = totalSales; // or a different calc if needed
    const totalExpenses = areachartData.reduce((acc, cur) => acc + (cur.expense ?? 0), 0);

    useEffect(() => {
        getCompanyDetails();
    }, []);

    const getCompanyDetails = async () => {
        try {
            setLoading(true);

            const localCompanyId = localStorage.getItem('selectedCompanyId');
            const finalCompanyId = companyId || localCompanyId;
            if (!finalCompanyId) {
                setError('Company ID is missing.');
                return;
            }

            const res = await getCompanyById(finalCompanyId);
            console.log("===response data", res.data)
            if (res.success) {
                setCompanyData(res.data);
            } else {
                setError('Failed to load company details.');
            }
        } catch (err) {
            setError('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };
    const dashboardStats = [
        {
            label: "Total Customers",
            value: "56",
            icon: Users,
            iconBg: "bg-blue-600",
            iconColor: "text-white",
            barColor: "bg-blue-400",
            barProgress: 60,
            change: "+12% since last month",
            color: "from-blue-100 via-white to-blue-100",
        },
        {
            label: "Total Products",
            value: "120",
            icon: Package,
            iconBg: "bg-green-600",
            iconColor: "text-white",
            barColor: "bg-green-400",
            barProgress: 80,
            change: "+8 added this week",
            color: "from-green-100 via-white to-green-100",
        },
        {
            label: "Pending Invoices",
            value: "5",
            icon: FileWarning,
            iconBg: "bg-red-600",
            iconColor: "text-white",
            barColor: "bg-red-400",
            barProgress: 35,
            change: "Requires attention",
            color: "from-red-100 via-white to-red-100",
        },
        {
            label: "Overdue Invoices",
            value: "2",
            icon: AlarmClock,
            iconBg: "bg-yellow-500",
            iconColor: "text-white",
            barColor: "bg-yellow-400",
            barProgress: 25,
            change: "Overdue this week",
            color: "from-yellow-100 via-white to-yellow-100",
        },
    ];

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-600">{error}</p>
                </div>
            </Layout>
        );
    }

    const total = React.useMemo(
        () => ({
            income: chartData.reduce((acc, curr) => acc + curr.income, 0),
            expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
        }),
        []
    )



    return (
        <div>
            {loading && (
                <div className="min-h-[calc(97vh-64px)] flex items-center justify-center">
                    <Loader isInside={true} />
                </div>

            )}
            {
                companyData !== null && (
                    <div className=" rounded-xl p-5 h-full">
                        <div className="">
                            <div className="text-xl font-bold text-gray-900">{companyData?.companyName}</div>
                            <div className="text-sm text-gray-700">
                                <strong>Industry: </strong>{companyData?.industry}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                            {dashboardStats.map((stat, idx) => (
                                <Card
                                    key={idx}
                                    className={`relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-br ${stat.color}`}
                                >
                                    {/* Header with label and icon */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                                        </div>
                                        {/* <div className={`rounded-tr-xl rounded-bl-3xl rounded-tl-md rounded-br-md p-3 ${stat.iconBg} text-white shadow-md`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div> */}
                                        <div
                                            className={`min-w-[44px] sm:min-w-[44px] p-3 sm:p-3 
              rounded-tr-xl rounded-bl-3xl rounded-tl-md rounded-br-md 
              ${stat.iconBg} text-white shadow-md flex items-center justify-center`}
                                        >
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{stat.change}</span>
                                            <span className="text-xs text-muted-foreground">vs last week</span>
                                        </div>
                                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-2 ${stat.barColor} rounded-full`}
                                                style={{ width: stat.barProgress + '%' }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 items-stretch">
                            <div className="lg:col-span-3 w-full">
                                <Card className="shadow-md">
                                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center border-b !p-0 sm:justify-between">
                                        <div className="flex flex-col sm:flex-row flex-1 justify-between gap-4 px-6 pt-4 pb-3 sm:py-6 sm:pr-4">
                                            <div className="flex flex-col justify-center">
                                                <CardTitle>Income - Expense</CardTitle>
                                                <CardDescription>
                                                    Showing total income - expense for the last month
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center sm:justify-end w-full sm:w-[160px]">
                                                <Select value={barChartRange} onValueChange={setBarChartRange}>
                                                    <SelectTrigger className="w-full rounded-lg" aria-label="Select a value">
                                                        <SelectValue placeholder="Last 3 months" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                                                        <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex w-full sm:w-auto flex-wrap border-t sm:border-t-0 sm:border-l divide-x">
                                            {(["income", "expense", "both"] as ChartType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    data-active={activeChart === type}
                                                    onClick={() => setActiveChart(type)}
                                                    className={cn(
                                                        "flex flex-col justify-center gap-1 px-6 py-3 text-left w-full sm:w-auto",
                                                        activeChart === type && "bg-muted/50"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-xs",
                                                            type === "income" && "text-green-600",
                                                            type === "expense" && "text-red-600",
                                                            type === "both" && "text-[#3e4a6b]"
                                                        )}
                                                    >
                                                        {type === "both" ? "Balance" : barChartConfig[type].label}
                                                    </span>
                                                    <span className="text-lg leading-none font-bold sm:text-3xl">
                                                        {type === "both"
                                                            ? (total.income - total.expense).toLocaleString()
                                                            : total[type].toLocaleString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={barChartConfig} className="aspect-auto h-[270px] w-full mt-5">
                                            <BarChart accessibilityLayer data={barChartFilterData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="date" // change to "month" if your data uses month not date
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tickFormatter={(value) => {
                                                        const date = new Date(value);
                                                        return date.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        });
                                                    }}
                                                />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                                {(activeChart === "income" || activeChart === "both") && (
                                                    <Bar dataKey="income" fill={barChartConfig.income.color} radius={5}>
                                                        {
                                                            (activeChart === 'income' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground"
                                                                fontSize={12}
                                                            />
                                                        }

                                                    </Bar>
                                                )}
                                                {(activeChart === "expense" || activeChart === "both") && (
                                                    <Bar dataKey="expense" fill={barChartConfig.expense.color} radius={5}>
                                                        {
                                                            (activeChart === 'expense' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground"
                                                                fontSize={12}
                                                            />
                                                        }
                                                    </Bar>
                                                )}
                                                <ChartLegend content={<ChartLegendContent />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="lg:col-span-1 w-full">
                                <Card className="flex flex-col shadow-md">
                                    <CardHeader className="items-center pb-0">
                                        <CardTitle>Income - Expense</CardTitle>
                                        <CardDescription>January - June 2024</CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-2 pt-1 sm:px-6 sm:pt-6 ">
                                        <ChartContainer
                                            config={piechartConfig}
                                            className="aspect-auto h-[335px] w-full"
                                        >
                                            <PieChart>
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                                <Pie data={piechartData} dataKey="visitors" nameKey="browser" />
                                                <ChartLegend
                                                    content={<ChartLegendContent nameKey="browser" />}
                                                    className="w-full max-w-[500px] -translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
                                                />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div> */}

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 xl:grid-cols-4 mt-4">

                            <div className="bg-blue-300 h-[500px] rounded-2xl lg:col-span-1 xl:col-span-3 flex items-center justify-center">
                                <Card className='shadow-md w-full h-full flex flex-col rounded-2xl'>
                                    <CardHeader className='flex flex-row flex-wrap p-0 border-b'>
                                        <div className="flex flex-col lg:flex-row flex-1 justify-between gap-4 px-4 py-2">
                                            <div className='flex flex-col justify-center'>
                                                <CardTitle className="text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                                                    Income - Expense
                                                </CardTitle>
                                                <CardDescription>
                                                    Showing total income - expense for the last month
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center sm:justify-end w-full lg:w-[160px]">
                                                <Select value={barChartRange} onValueChange={setBarChartRange}>
                                                    <SelectTrigger className="w-full rounded-lg" aria-label="Select a value">
                                                        <SelectValue placeholder="Last 3 months" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                                                        <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap border-l w-full  lg:w-auto  md:justify-between border-t lg:border-t-0">
                                            {(["income", "expense", "both"] as ChartType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    data-active={activeChart === type}
                                                    onClick={() => setActiveChart(type)}
                                                    className={cn("flex flex-col items-start gap-1 px-6 py-3", activeChart === type && "bg-muted/50")}
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-xs",
                                                            type === "income" && "text-green-600",
                                                            type === "expense" && "text-red-600",
                                                            type === "both" && "text-[#3e4a6b]"
                                                        )}
                                                    >
                                                        {type === "both" ? "Balance" : barChartConfig[type].label}
                                                    </span>
                                                    <span className="text-lg leading-none font-bold lg:text-2xl">
                                                        {type === "both"
                                                            ? (total.income - total.expense).toLocaleString()
                                                            : total[type].toLocaleString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-hidden">
                                        <ChartContainer config={barChartConfig} className="w-full h-full">
                                            <BarChart accessibilityLayer data={barChartFilterData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="date" // change to "month" if your data uses month not date
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tickFormatter={(value) => {
                                                        const date = new Date(value);
                                                        return date.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        });
                                                    }}
                                                />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                                {(activeChart === "income" || activeChart === "both") && (
                                                    <Bar dataKey="income" fill={barChartConfig.income.color} radius={5} isAnimationActive animationDuration={800} animationEasing='ease-in-out'>
                                                        {
                                                            (activeChart === 'income' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground label-text"
                                                            />
                                                        }

                                                    </Bar>
                                                )}
                                                {(activeChart === "expense" || activeChart === "both") && (
                                                    <Bar dataKey="expense" fill={barChartConfig.expense.color} radius={5} isAnimationActive animationDuration={800} animationEasing='ease-in-out'>
                                                        {
                                                            (activeChart === 'expense' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground label-text"
                                                            />
                                                        }
                                                    </Bar>
                                                )}
                                                <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>


                            <div className=" h-[500px] rounded-2xl w-full">
                                <Card className="shadow-md w-full h-full flex flex-col rounded-2xl">
                                    <CardHeader className="items-center pb-0">
                                        <CardTitle className='lg:text-lg xl:text-xl 2xl:text-2xl'>Income - Expense</CardTitle>
                                        <CardDescription>January - June 2024</CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-2 pt-1 sm:px-6 sm:pt-4 flex flex-col justify-center ">
                                        <ChartContainer
                                            config={piechartConfig}
                                            className="h-full w-full flex flex-col items-center justify-center"
                                        >
                                            <PieChart>
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                                <Pie data={piechartData} dataKey="visitors" nameKey="browser" />
                                                <ChartLegend
                                                    content={<ChartLegendContent nameKey="browser" payload={undefined} />}
                                                    className="w-full max-w-[600px] -translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
                                                />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        {/* <div className={styles.ChartStyle}>
                            <div className={styles["bar-chart-card"]}>
                                <Card className={styles.card}>
                                    <CardHeader className={styles["card-header"]}>
                                        <div className={styles["header-left"]}>
                                            <div className={styles.info}>
                                                <CardTitle>Income - Expense</CardTitle>
                                                <CardDescription>Showing total income - expense for the last month</CardDescription>
                                            </div>
                                            <div className={styles.dropdown}>
                                                <Select value={barChartRange} onValueChange={setBarChartRange}>
                                                    <SelectTrigger className="w-full rounded-lg" aria-label="Select a value">
                                                        <SelectValue placeholder="Last 3 months" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                                                        <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className={styles["toggle-buttons"]}>
                                            {(["income", "expense", "both"] as ChartType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    data-active={activeChart === type}
                                                    onClick={() => setActiveChart(type)}
                                                    className={cn(
                                                        "flex flex-col justify-center gap-1 px-6 py-3 text-left w-full sm:w-auto",
                                                        activeChart === type && "bg-muted/50"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-xs",
                                                            type === "income" && "text-green-600",
                                                            type === "expense" && "text-red-600",
                                                            type === "both" && "text-[#3e4a6b]"
                                                        )}
                                                    >
                                                        {type === "both" ? "Balance" : barChartConfig[type].label}
                                                    </span>
                                                    <span className="text-lg leading-none font-bold sm:text-3xl">
                                                        {type === "both"
                                                            ? (total.income - total.expense).toLocaleString()
                                                            : total[type].toLocaleString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </CardHeader>

                                    <CardContent className={styles["card-content"]}>
                                        <ChartContainer className={styles["chart-container"]} config={barChartConfig}>
                                            <BarChart accessibilityLayer data={barChartFilterData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="date" // change to "month" if your data uses month not date
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tickFormatter={(value) => {
                                                        const date = new Date(value);
                                                        return date.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        });
                                                    }}
                                                />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                                {(activeChart === "income" || activeChart === "both") && (
                                                    <Bar dataKey="income" fill={barChartConfig.income.color} radius={5}>
                                                        {
                                                            (activeChart === 'income' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground"
                                                                fontSize={12}
                                                            />
                                                        }

                                                    </Bar>
                                                )}
                                                {(activeChart === "expense" || activeChart === "both") && (
                                                    <Bar dataKey="expense" fill={barChartConfig.expense.color} radius={5}>
                                                        {
                                                            (activeChart === 'expense' || barChartRange === '7d') && <LabelList
                                                                position="top"
                                                                offset={5}
                                                                className="fill-foreground"
                                                                fontSize={12}
                                                            />
                                                        }
                                                    </Bar>
                                                )}
                                                <ChartLegend content={<ChartLegendContent />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className={styles["pie-chart-card"]}>
                                <Card className={styles.card}>
                                    <CardHeader className={styles["card-header"]}>
                                        <CardTitle>Income - Expense</CardTitle>
                                        <CardDescription>January - June 2024</CardDescription>
                                    </CardHeader>

                                    <CardContent className={styles["card-content"]}>
                                        <ChartContainer className={styles["chart-container"]} config={piechartConfig}>
                                            <PieChart>
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                                <Pie data={piechartData} dataKey="visitors" nameKey="browser" />
                                                <ChartLegend
                                                    content={<ChartLegendContent nameKey="browser" />}
                                                    className="w-full max-w-[500px] -translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
                                                />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </div> */}

                        <div className='w-full mt-4'>
                            <Card className="mt-3 shadow-md rounded-2xl">
                                <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
                                    {/* <div className="grid flex-1 gap-1">
                                        <CardTitle>Sales and Purchase</CardTitle>
                                        <CardDescription>
                                            Sales value displayed is inclusive of tax and inclusive of credits.
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center sm:justify-end w-full lg:w-[160px]">
                                        <Select value={timeRange} onValueChange={setTimeRange} >
                                            <SelectTrigger
                                                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                                aria-label="Select a value"
                                            >
                                                <SelectValue placeholder="Last 3 months" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="90d" className="rounded-lg">
                                                    Last 3 months
                                                </SelectItem>
                                                <SelectItem value="30d" className="rounded-lg">
                                                    Last 30 days
                                                </SelectItem>
                                                <SelectItem value="7d" className="rounded-lg">
                                                    Last 7 days
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div> */}
                                    <div className="flex flex-col lg:flex-row flex-1 justify-between gap-4 px-4 py-1">
                                        <div className='flex flex-col justify-center'>
                                            <CardTitle className="text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                                                Sales and Purchase
                                            </CardTitle>
                                            <CardDescription>
                                                Sales value displayed is inclusive of tax and inclusive of credits.
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center sm:justify-end w-full lg:w-[160px]">
                                            <Select value={timeRange} onValueChange={setTimeRange} >
                                                <SelectTrigger
                                                    className="w-full rounded-lg"
                                                    aria-label="Select a value"
                                                >
                                                    <SelectValue placeholder="Last 3 months" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="90d" className="rounded-lg">
                                                        Last 3 months
                                                    </SelectItem>
                                                    <SelectItem value="30d" className="rounded-lg">
                                                        Last 30 days
                                                    </SelectItem>
                                                    <SelectItem value="7d" className="rounded-lg">
                                                        Last 7 days
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* <CardContent className="flex flex-col sm:flex-row sm:gap-6 sm:px-6 sm:pt-6">
                                    <div className="flex-1">
                                        <ChartContainer
                                            config={chartConfig}
                                            className="aspect-auto h-[280px] w-full"
                                        >
                                            <AreaChart data={filteredData} accessibilityLayer>

                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    minTickGap={32}
                                                    tickFormatter={(value) => {
                                                        const date = new Date(value)
                                                        return date.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                    }}
                                                />

                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent
                                                            labelFormatter={(value) => {
                                                                return new Date(value).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                            }}
                                                            indicator="dot"
                                                        />
                                                    }
                                                />
                                                <Area
                                                    dataKey="income"
                                                    type="natural"
                                                    fill="var(--color-income)"
                                                    stroke="var(--color-income)"
                                                    stackId="a"
                                                    fillOpacity={0.1}
                                                />
                                                <Area
                                                    dataKey="expense"
                                                    type="natural"
                                                    fill="var(--color-expense)"
                                                    stroke="var(--color-expense)"
                                                    stackId="a"
                                                    fillOpacity={0.1}
                                                />
                                                <ChartLegend content={<ChartLegendContent />} />
                                            </AreaChart>
                                        </ChartContainer>


                                    </div>
                                    <div className="w-[100px] xl:w-[180px] border-t sm:border-t-0 sm:border-l sm:pl-4 pt-4 sm:pt-0 text-sm">
                                        <div className="flex flex-col gap-5">

                                            <div className="flex flex-col items-end justify-end">
                                                <span className="text-green-600 font-medium">Total Sales</span>
                                                <span className="text-black text-xl">â‚¹{totalReceipts.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col items-end justify-end">
                                                <span className="text-red-600 font-medium">Total Purchase</span>
                                                <span className="text-black text-xl">â‚¹{totalExpenses.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent> */}
                                <CardContent className="flex flex-col lg:flex-row gap-6 px-4 lg:px-6 pt-4 lg:pt-6">
                                    <div className="flex-1">
                                        <ChartContainer
                                            config={chartConfig}
                                            className="aspect-auto h-[280px] w-full"
                                        >
                                            <AreaChart data={filteredData} accessibilityLayer>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    minTickGap={32}
                                                    tickFormatter={(value) => {
                                                        const date = new Date(value)
                                                        return date.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                    }}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent
                                                            labelFormatter={(value) => {
                                                                return new Date(value).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                            }}
                                                            indicator="dot"
                                                        />
                                                    }
                                                />
                                                <Area
                                                    dataKey="income"
                                                    type="natural"
                                                    fill="var(--color-income)"
                                                    stroke="var(--color-income)"
                                                    stackId="a"
                                                    fillOpacity={0.1}
                                                />
                                                <Area
                                                    dataKey="expense"
                                                    type="natural"
                                                    fill="var(--color-expense)"
                                                    stroke="var(--color-expense)"
                                                    stackId="a"
                                                    fillOpacity={0.1}
                                                />
                                                <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </div>

                                    {/* <div className="w-full lg:w-[180px] border-t lg:border-t-0 lg:border-l lg:pl-4 pt-4 lg:pt-0 text-sm">
                                        <div className="flex flex-col md:flex-row lg:flex-col gap-5 w-full">
                                            <div className="flex flex-col items-end justify-end w-full">
                                                <span className="text-green-600 font-medium">Total Sales</span>
                                                <span className="text-black text-xl">â‚¹{totalReceipts.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col items-end justify-end w-full">
                                                <span className="text-red-600 font-medium">Total Purchase</span>
                                                <span className="text-black text-xl">â‚¹{totalExpenses.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className=" xl:w-[180px] border-t sm:border-t-0 border-l  sm:pl-4 pt-4 sm:pt-0 text-sm [@media(width:375px)]:border-l-0
  [@media(width:425px)]:border-l-0
  [@media(width:768px)]:border-l-0">
                                        <div className="flex flex-col gap-5 [@media(width:768px)]:flex-row [@media(width:425px)]:flex-row  [@media(width:375px)]:flex-row ">
                                            <div className="flex flex-col items-end justify-end">
                                                <span className="text-green-600 font-medium ">Total Sales</span>
                                                <span className="text-black text-xl">â‚¹{totalReceipts.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col items-end justify-end">
                                                <span className="text-red-600 font-medium">Total Purchase</span>
                                                <span className="text-black text-xl">â‚¹{totalExpenses.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>



                )
            }
        </div>
    );
};

;
export default function DashboardScreenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardScreen />
    </Suspense>
  );
}
