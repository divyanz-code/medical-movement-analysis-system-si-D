import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Filter, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { BottomNav } from "../components/BottomNav";
import { StatusChip } from "../components/StatusChip";
import { mockAssessments } from "../lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

export function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  const filteredAssessments = mockAssessments.filter((assessment) => {
    const matchesSearch =
      assessment.jointType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.taskType.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "all") return matchesSearch;
    if (filterTab === "knee")
      return matchesSearch && assessment.jointType.includes("Knee");
    if (filterTab === "shoulder")
      return matchesSearch && assessment.jointType.includes("Shoulder");

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 pt-12 pb-4">
        <h1 className="text-2xl font-semibold mb-4">Assessment History</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by joint or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterTab} onValueChange={setFilterTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="knee" className="flex-1">
              Knee
            </TabsTrigger>
            <TabsTrigger value="shoulder" className="flex-1">
              Shoulder
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* History List */}
      <div className="px-6 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredAssessments.length} assessments
          </p>
          <button className="flex items-center gap-2 text-sm text-accent hover:underline">
            <Filter className="w-4 h-4" />
            Sort
          </button>
        </div>

        <div className="space-y-3">
          {filteredAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate(`/history/${assessment.id}`)}
            >
              <div className="flex items-start gap-4">
                {/* Date Circle */}
                <div className="flex-shrink-0 w-16 h-16 bg-accent/10 rounded-full flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold text-accent">
                    {new Date(assessment.date).getDate()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(assessment.date).toLocaleString("en-US", {
                      month: "short",
                    })}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{assessment.jointType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assessment.taskType}
                      </p>
                    </div>
                    <StatusChip
                      status={
                        assessment.compensationDetected ? "warning" : "aligned"
                      }
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className="text-lg font-semibold">
                        {assessment.movementScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROM</p>
                      <p className="text-lg font-semibold">
                        {assessment.rom}°
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm">
                        {new Date(assessment.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No assessments found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
