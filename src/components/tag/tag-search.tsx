import { Edit, Search, Tag, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EmptyState } from "../common/EmptyState";
import { Badge } from "../ui/badge";
import type { Tag as TagType } from "@/types";
import { useTagStore } from "@/store";

interface TagSearchProps {
  tags: TagType[];
  search: string;
  setSearch: (search: string) => void;
  fetchTags: (search: string) => void;
  filtered: TagType[];
  setDeleteId: (id: string) => void;
  openEdit: (tag: TagType) => void;
}

const TagSearch = ({
  tags,
  search,
  setSearch,
  fetchTags,
  filtered,
  setDeleteId,
  openEdit,
}: TagSearchProps) => {
  const loading = useTagStore((state) => state.loading);

  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tags…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchTags(e.target.value);
            }}
            className="pl-9 h-9"
          />
        </div>

        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearch("");
              fetchTags("");
            }}
            className="cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* EMPTY STATE */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">Loading tags...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No tags found"
          icon={<Tag className="w-8 h-8 text-muted-foreground/40" />}
        />
      ) : (
        <div className="p-5">
          {/* TAG CLOUD */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[...filtered]
              .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
              .map((tag, idx) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group flex items-center gap-1.5 border rounded-full px-3 py-1.5 bg-card hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-2">
                    {tag.color && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">#{tag.slug}</span>
                  </div>

                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 h-4 ml-1"
                  >
                    {tag.postCount ?? 0}
                  </Badge>

                  <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                    <button
                      // @ts-ignore
                      onClick={() => openEdit(tag)}
                      className="p-0.5 hover:text-primary cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteId(tag.id)}
                      className="p-0.5 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* TABLE */}
          <div className="border-t pt-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              By Post Count
            </p>

            <div className="space-y-1">
              {[...filtered]
                .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
                .map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {tag.color && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                      <span className="text-sm font-medium">#{tag.name}</span>
                    </div>

                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((tag.postCount ?? 0) / 30) * 100,
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {tag.postCount ?? 0} posts
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 cursor-pointer"
                        // @ts-ignore
                        onClick={() => openEdit(tag)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:bg-red-500/10 cursor-pointer"
                        onClick={() => setDeleteId(tag.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSearch;
