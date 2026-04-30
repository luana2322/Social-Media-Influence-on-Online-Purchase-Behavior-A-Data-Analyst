"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Play } from "lucide-react";

const demoData = [
  { user_id: 1001, purchase_probability: 0.87, segment: "High" },
  { user_id: 1002, purchase_probability: 0.45, segment: "Medium" },
  { user_id: 1003, purchase_probability: 0.12, segment: "Low" },
  { user_id: 1004, purchase_probability: 0.92, segment: "High" },
  { user_id: 1005, purchase_probability: 0.34, segment: "Low" },
  { user_id: 1006, purchase_probability: 0.78, segment: "High" },
  { user_id: 1007, purchase_probability: 0.56, segment: "Medium" },
  { user_id: 1008, purchase_probability: 0.23, segment: "Low" },
];

const pieData = [
  { name: "High", value: 35, color: "#22c55e" },
  { name: "Medium", value: 40, color: "#eab308" },
  { name: "Low", value: 25, color: "#ef4444" },
];

export default function DemoSection() {
  const { t, language } = useLanguage();
  const [showDemo, setShowDemo] = useState(false);

  const handleTryDemo = () => {
    setShowDemo(true);
  };

  const getSegmentBadge = (segment: string) => {
    const variant =
      segment === "High" ? "default" : segment === "Medium" ? "secondary" : "destructive";
    const viSegment =
      segment === "High" ? "Cao" : segment === "Medium" ? "Trung bình" : "Thấp";
    return (
      <Badge variant={variant}>{language === "vi" ? viSegment : segment}</Badge>
    );
  };

  return (
    <section id="demo-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {language === "vi" ? "Xem Demo Trực Tiếp" : "See It In Action"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {language === "vi"
              ? "Không cần tải lên - xem kết quả mẫu ngay lập tức"
              : "No upload required - see sample results instantly"}
          </p>
        </div>

        {!showDemo ? (
          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={handleTryDemo}
              className="rounded-full px-8 py-6 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {language === "vi" ? "Thử Demo Ngay" : "Try Demo Dataset"}
            </Button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Sample Results Table */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>
                  {language === "vi" ? "Kết quả mẫu" : "Sample Results"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>
                        {language === "vi" ? "Xác suất" : "Probability"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Phân khúc" : "Segment"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoData.map((row) => (
                      <TableRow key={row.user_id}>
                        <TableCell className="font-medium">
                          {row.user_id}
                        </TableCell>
                        <TableCell>
                          {row.purchase_probability.toFixed(2)}
                        </TableCell>
                        <TableCell>{getSegmentBadge(row.segment)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Segmentation Pie Chart */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>
                  {language === "vi" ? "Phân bố phân khúc" : "Segment Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mini Use-Case */}
        {showDemo && (
          <div className="mt-12 rounded-2xl bg-green-50 p-8 text-center">
            <p className="text-2xl font-bold text-green-600">
              {language === "vi" ? "+27% Chuyển đổi" : "+27% Conversion Increase"}
            </p>
            <p className="mt-2 text-muted-foreground">
              {language === "vi"
                ? "Khách hàng phân khúc Cao chuyển đổi gấp 2 lần"
                : "High segment converts at 2x rate"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
