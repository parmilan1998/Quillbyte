"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  ArrowUpDown,
  ShieldAlert,
  Trash2,
  Edit,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import { STATUS_COLORS, ROLE_COLORS } from "@/constants";
import type { User } from "@/types";
import { toast } from "sonner";
import { userService } from "@/services/client/user-service";
import { authClient } from "@/lib/client";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowSelection, setRowSelection] = useState({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", statusFilter],
    queryFn: () => userService.getUsers({ status: statusFilter, limit: 50 }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => userService.setStatus(id, "SUSPENDED"),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("User suspended");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => userService.setStatus(id, "ACTIVE"),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("User reactivated");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setDeleteId(null);
    },
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
        enableSorting: false,
      },
      {
        id: "user",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 cursor-pointer"
            onClick={() => column.toggleSorting()}
          >
            User <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 opacity-60" />
          </Button>
        ),
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar size="sm">
                <AvatarImage
                  src={row.original.avatar}
                  alt={row.original.name}
                />
                <AvatarFallback>
                  {getInitials(row.original.name)}
                </AvatarFallback>
              </Avatar>
              {row.original.isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold">✓</span>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            className={`text-[11px] capitalize border ${ROLE_COLORS[row.original.role]}`}
          >
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={`text-[11px] capitalize border ${STATUS_COLORS[row.original.status]}`}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "postCount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 cursor-pointer"
            onClick={() => column.toggleSorting()}
          >
            Posts <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 opacity-60" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.postCount}</span>
        ),
      },
      {
        accessorKey: "followerCount",
        header: "Followers",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatNumber(row.original.followerCount)}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.createdAt, "MMM d, yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const isSelf = row.original.id === session?.user?.id;
          return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={isSelf}
                onClick={() =>
                  userService
                    .setRole(
                      row.original.id,
                      row.original.role === "admin" ? "USER" : "ADMIN",
                    )
                    .then((result) => {
                      if (!result.success) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(
                        row.original.role === "admin"
                          ? "Removed admin role"
                          : "Made admin",
                      );
                      queryClient.invalidateQueries({
                        queryKey: ["admin", "users"],
                      });
                    })
                }
              >
                <Edit className="w-4 h-4" />
                {row.original.role === "admin"
                  ? "Remove Admin Role"
                  : "Make Admin"}
              </DropdownMenuItem>
              {row.original.status === "suspended" ? (
                <DropdownMenuItem
                  disabled={isSelf}
                  onClick={() => reactivateMutation.mutate(row.original.id)}
                >
                  <ShieldAlert className="w-4 h-4" /> Reactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={isSelf}
                  onClick={() => suspendMutation.mutate(row.original.id)}
                >
                  <ShieldAlert className="w-4 h-4" /> Suspend
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isSelf}
                className="text-danger focus:text-danger"
                onClick={() => setDeleteId(row.original.id)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          );
        },
      },
    ],
    [session?.user?.id],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            {data?.meta.total ?? 0} registered users
          </p>
        </div>
        <Button
          size="sm"
          className=" cursor-pointer"
          onClick={() =>
            toast.info(
              "Inviting users isn't available yet — no email provider is configured.",
            )
          }
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users…"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className=" cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className=" cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This scrubs the account's name, email, and photo, force-logs
              them out everywhere, and removes their sign-in credentials —
              they can't come back as this account. Their posts and
              comments stay published, attributed to "Deleted User"
              instead of disappearing. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
