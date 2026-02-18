import * as React from "react"
import { Users, Briefcase, CalendarCheck, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts"

const data = [
  { name: "Mon", interviews: 12 },
  { name: "Tue", interviews: 19 },
  { name: "Wed", interviews: 15 },
  { name: "Thu", interviews: 22 },
  { name: "Fri", interviews: 28 },
  { name: "Sat", interviews: 8 },
  { name: "Sun", interviews: 4 },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground text-[#800080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground text-[#800080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+12 new positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground text-[#800080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 completed, 8 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-[#800080]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Interview Activity</CardTitle>
            <CardDescription>Daily interview sessions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar
                    dataKey="interviews"
                    fill="#800080"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-[#800080]">
                  <Users className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New Candidate Applied</p>
                  <p className="text-xs text-muted-foreground text-gray-500">
                    Sarah Connor applied for Senior Engineer
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-gray-500">2m ago</div>
              </div>
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Interview Completed</p>
                  <p className="text-xs text-muted-foreground text-gray-500">
                    John Doe completed the coding assessment
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-gray-500">1h ago</div>
              </div>
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New Job Posted</p>
                  <p className="text-xs text-muted-foreground text-gray-500">
                    Product Manager role at TechCorp
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-gray-500">3h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
