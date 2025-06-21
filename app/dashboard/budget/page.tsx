"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Plus,
  TrendingUp,
  DollarSign,
  Plane,
  Utensils,
  MapPin,
  Calendar,
  PieChart,
  Target,
  AlertTriangle,
} from "lucide-react"

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  icon: any
  color: string
}

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  trip?: string
}

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState(5000)

  const [categories] = useState<BudgetCategory[]>([
    {
      id: "1",
      name: "Flights",
      budgeted: 1500,
      spent: 1200,
      icon: Plane,
      color: "blue",
    },
    {
      id: "2",
      name: "Accommodation",
      budgeted: 1200,
      spent: 800,
      icon: MapPin,
      color: "green",
    },
    {
      id: "3",
      name: "Food & Dining",
      budgeted: 800,
      spent: 650,
      icon: Utensils,
      color: "orange",
    },
    {
      id: "4",
      name: "Activities",
      budgeted: 600,
      spent: 450,
      icon: Calendar,
      color: "purple",
    },
    {
      id: "5",
      name: "Transportation",
      budgeted: 400,
      spent: 320,
      icon: CreditCard,
      color: "red",
    },
    {
      id: "6",
      name: "Shopping",
      budgeted: 500,
      spent: 280,
      icon: Target,
      color: "pink",
    },
  ])

  const [recentExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Flight to Tokyo",
      amount: 1200,
      category: "Flights",
      date: "2024-12-15",
      trip: "Japan Adventure",
    },
    {
      id: "2",
      description: "Hotel in Shibuya",
      amount: 150,
      category: "Accommodation",
      date: "2024-12-14",
      trip: "Japan Adventure",
    },
    {
      id: "3",
      description: "Sushi dinner",
      amount: 85,
      category: "Food & Dining",
      date: "2024-12-13",
      trip: "Japan Adventure",
    },
    {
      id: "4",
      description: "Tokyo Disneyland tickets",
      amount: 120,
      category: "Activities",
      date: "2024-12-12",
      trip: "Japan Adventure",
    },
    {
      id: "5",
      description: "JR Pass",
      amount: 280,
      category: "Transportation",
      date: "2024-12-10",
      trip: "Japan Adventure",
    },
  ])

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const remaining = totalBudget - totalSpent
  const spentPercentage = (totalSpent / totalBudget) * 100

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-green-600" />
            <span>Budget Tracker</span>
          </h1>
          <p className="text-muted-foreground mt-2">Track your travel expenses and stay within budget</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Budget</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Spent</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br border-0 ${
            remaining >= 0
              ? "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
              : "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {remaining >= 0 ? (
                <DollarSign className="h-5 w-5 text-purple-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    remaining >= 0 ? "text-purple-700 dark:text-purple-300" : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {remaining >= 0 ? "Remaining" : "Over Budget"}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    remaining >= 0 ? "text-purple-800 dark:text-purple-200" : "text-red-800 dark:text-red-200"
                  }`}
                >
                  ${Math.abs(remaining).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Budget Used</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{spentPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>Overall spending progress across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: ${totalSpent.toLocaleString()}</span>
              <span>Budget: ${totalBudget.toLocaleString()}</span>
            </div>
            <Progress value={spentPercentage} className={`h-3 ${spentPercentage > 100 ? "bg-red-100" : ""}`} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{spentPercentage.toFixed(1)}% used</span>
              <span>
                {remaining >= 0
                  ? `$${remaining.toLocaleString()} remaining`
                  : `$${Math.abs(remaining).toLocaleString()} over budget`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const percentage = (category.spent / category.budgeted) * 100
              const isOverBudget = category.spent > category.budgeted

              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <category.icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <Badge className={getCategoryColor(category.color)}>{percentage.toFixed(0)}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${category.spent.toLocaleString()}</span>
                        <span>Budget: ${category.budgeted.toLocaleString()}</span>
                      </div>

                      <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`}
                      />

                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                          {isOverBudget
                            ? `$${(category.spent - category.budgeted).toLocaleString()} over`
                            : `$${(category.budgeted - category.spent).toLocaleString()} left`}
                        </span>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest travel spending activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-muted">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{expense.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {expense.category}
                          </Badge>
                          {expense.trip && (
                            <>
                              <span>•</span>
                              <span>{expense.trip}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${expense.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Button variant="ghost">View All Expenses</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
