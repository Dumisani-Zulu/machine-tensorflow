'use client'

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Power, 
  Search, 
  Settings, 
  Wrench,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Eye
} from "lucide-react"
import { Machine, MachineFilters } from "@/types"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Mock data - in a real app, this would come from an API
const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Crusher Unit A1',
    type: 'Crusher',
    status: 'online',
    healthStatus: 'good',
    location: 'Sector A',
    lastMaintenance: '2024-06-15',
    nextMaintenance: '2024-08-15',
    operatingHours: 2847,
    efficiency: 87,
    temperature: 72,
    pressure: 8.5,
    vibration: 2.3
  },
  {
    id: '2',
    name: 'Belt Conveyor B2',
    type: 'Belt Conveyor',
    status: 'online',
    healthStatus: 'excellent',
    location: 'Sector B',
    lastMaintenance: '2024-07-01',
    nextMaintenance: '2024-09-01',
    operatingHours: 1924,
    efficiency: 94,
    temperature: 45,
    pressure: 6.2,
    vibration: 1.1
  },
  {
    id: '3',
    name: 'Excavator X1',
    type: 'Excavator',
    status: 'offline',
    healthStatus: 'critical',
    location: 'Sector C',
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-07-20',
    operatingHours: 3642,
    efficiency: 45,
    temperature: 95,
    pressure: 12.8,
    vibration: 4.7
  },
  {
    id: '4',
    name: 'Drill Rig D1',
    type: 'Drill',
    status: 'maintenance',
    healthStatus: 'warning',
    location: 'Sector D',
    lastMaintenance: '2024-07-10',
    nextMaintenance: '2024-09-10',
    operatingHours: 2156,
    efficiency: 72,
    temperature: 68,
    pressure: 9.1,
    vibration: 3.2
  },
  {
    id: '5',
    name: 'Loader L3',
    type: 'Loader',
    status: 'online',
    healthStatus: 'good',
    location: 'Sector A',
    lastMaintenance: '2024-06-25',
    nextMaintenance: '2024-08-25',
    operatingHours: 1789,
    efficiency: 82,
    temperature: 58,
    pressure: 7.4,
    vibration: 2.0
  },
  {
    id: '6',
    name: 'Haul Truck H1',
    type: 'Haul Truck',
    status: 'online',
    healthStatus: 'excellent',
    location: 'Sector B',
    lastMaintenance: '2024-06-30',
    nextMaintenance: '2024-08-30',
    operatingHours: 2398,
    efficiency: 91,
    temperature: 62,
    pressure: 8.9,
    vibration: 1.8
  },
  {
    id: '7',
    name: 'Mill M2',
    type: 'Mill',
    status: 'online',
    healthStatus: 'warning',
    location: 'Sector C',
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-15',
    operatingHours: 3124,
    efficiency: 78,
    temperature: 84,
    pressure: 10.2,
    vibration: 3.8
  },
  {
    id: '8',
    name: 'Separator S1',
    type: 'Separator',
    status: 'offline',
    healthStatus: 'good',
    location: 'Sector D',
    lastMaintenance: '2024-07-05',
    nextMaintenance: '2024-09-05',
    operatingHours: 1567,
    efficiency: 85,
    temperature: 55,
    pressure: 6.8,
    vibration: 2.1
  }
];

export default function Machines() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [filters, setFilters] = useState<MachineFilters>({
    type: '',
    status: '',
    healthStatus: '',
    location: ''
  });

  // Calculate summary stats
  const totalMachines = machines.length;
  const onlineMachines = machines.filter(m => m.status === 'online').length;
  const criticalMachines = machines.filter(m => m.healthStatus === 'critical').length;
  const avgEfficiency = Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / totalMachines);

  // Filter and search machines
  const filteredMachines = useMemo(() => {
    return machines.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           machine.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           machine.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !filters.type || machine.type === filters.type;
      const matchesStatus = !filters.status || machine.status === filters.status;
      const matchesHealth = !filters.healthStatus || machine.healthStatus === filters.healthStatus;
      const matchesLocation = !filters.location || machine.location === filters.location;

      return matchesSearch && matchesType && matchesStatus && matchesHealth && matchesLocation;
    });
  }, [searchQuery, filters, machines]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'online': 'success',
      'offline': 'destructive',
      'maintenance': 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getHealthBadge = (health: string) => {
    const variants = {
      'excellent': 'success',
      'good': 'secondary',
      'warning': 'outline',
      'critical': 'destructive'
    } as const;
    return <Badge variant={variants[health as keyof typeof variants] || 'outline'}>{health}</Badge>;
  };

  const handleMachineClick = (machineId: string) => {
    router.push(`/machines/${machineId}`);
  };

  const handleStatusToggle = (machineId: string) => {
    setMachines(prevMachines => 
      prevMachines.map(machine => {
        if (machine.id === machineId) {
          const newStatus = machine.status === 'online' ? 'offline' : 'online';
          const machineName = machine.name;
          
          // Show toast notification
          toast({
            title: "Machine Status Updated",
            description: `${machineName} is now ${newStatus}`,
            variant: newStatus === 'online' ? 'default' : 'destructive',
          });
          
          return { ...machine, status: newStatus };
        }
        return machine;
      })
    );
  };

  const handleScheduleMaintenance = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      setMachines(prevMachines => 
        prevMachines.map(m => {
          if (m.id === machineId) {
            return { ...m, status: 'maintenance' };
          }
          return m;
        })
      );
      
      toast({
        title: "Maintenance Scheduled",
        description: `${machine.name} has been scheduled for maintenance`,
        variant: 'default',
      });
    }
  };

  const handleAnalyzePerformance = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      toast({
        title: "Performance Analysis",
        description: `Analyzing ${machine.name}... Efficiency: ${machine.efficiency}%`,
        variant: 'default',
      });
      
      // In a real app, this would navigate to analytics page or open a modal
      setTimeout(() => {
        router.push(`/machines/${machineId}`);
      }, 1000);
    }
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      healthStatus: '',
      location: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Header title="Machines" breadcrumbs={[{ label: "Machines" }]} />
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineMachines}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3" />
              {Math.round((onlineMachines / totalMachines) * 100)}% operational
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalMachines}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3" />
              Require immediate attention
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3" />
              Fleet performance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 hidden md:block" />
              <span className="text-[20px] md:text-lg">Search & Filter Machines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machines by name, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={filters.type || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Machine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Crusher">Crusher</SelectItem>
                  <SelectItem value="Belt Conveyor">Belt Conveyor</SelectItem>
                  <SelectItem value="Excavator">Excavator</SelectItem>
                  <SelectItem value="Drill">Drill</SelectItem>
                  <SelectItem value="Loader">Loader</SelectItem>
                  <SelectItem value="Haul Truck">Haul Truck</SelectItem>
                  <SelectItem value="Mill">Mill</SelectItem>
                  <SelectItem value="Separator">Separator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.healthStatus || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, healthStatus: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Health Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Health</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.location || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Sector A">Sector A</SelectItem>
                  <SelectItem value="Sector B">Sector B</SelectItem>
                  <SelectItem value="Sector C">Sector C</SelectItem>
                  <SelectItem value="Sector D">Sector D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-col md:flex gap-2 items-center">
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <div className="text-sm text-muted-foreground flex items-center">
                  Showing {filteredMachines.length} of {totalMachines} machines
                </div>
                <div className="hidden md:flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMachines.map((machine) => (
            <Card 
              key={machine.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMachineClick(machine.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{machine.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { 
                        e.stopPropagation(); 
                        handleStatusToggle(machine.id);
                      }}>
                        <Power className="mr-2 h-4 w-4" />
                        {machine.status === 'online' ? 'Take Offline' : 'Bring Online'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { 
                        e.stopPropagation(); 
                        handleScheduleMaintenance(machine.id);
                      }}>
                        <Wrench className="mr-2 h-4 w-4" />
                        Schedule Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAnalyzePerformance(machine.id);
                      }}>
                        <Activity className="mr-2 h-4 w-4" />
                        Analyze Performance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {machine.location} • {machine.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(machine.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Health:</span>
                  {getHealthBadge(machine.healthStatus)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Efficiency:</span>
                  <span className="text-sm font-bold">{machine.efficiency}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Operating Hours:
                  </span>
                  <span className="text-sm">{machine.operatingHours.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Next Maintenance:</span>
                    <span>{machine.nextMaintenance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Machine</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Health</th>
                    <th className="text-left p-4 font-medium">Efficiency</th>
                    <th className="text-left p-4 font-medium">Operating Hours</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.map((machine) => (
                    <tr 
                      key={machine.id}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleMachineClick(machine.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium text-sm">{machine.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{machine.type}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{machine.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(machine.status)}
                      </td>
                      <td className="p-4">
                        {getHealthBadge(machine.healthStatus)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{machine.efficiency}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all" 
                              style={{ width: `${machine.efficiency}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{machine.operatingHours.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { 
                              e.stopPropagation(); 
                              handleStatusToggle(machine.id);
                            }}>
                              <Power className="mr-2 h-4 w-4" />
                              {machine.status === 'online' ? 'Take Offline' : 'Bring Online'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { 
                              e.stopPropagation(); 
                              handleScheduleMaintenance(machine.id);
                            }}>
                              <Wrench className="mr-2 h-4 w-4" />
                              Schedule Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { 
                              e.stopPropagation(); 
                              handleAnalyzePerformance(machine.id);
                            }}>
                              <Activity className="mr-2 h-4 w-4" />
                              Analyze Performance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredMachines.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No machines found matching your search criteria.</p>
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
