import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CategoryCombobox = ({ value, onChange, placeholder = "Select or enter category...", className }: CategoryComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Fetch existing categories from posts
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(post => post.category))];
      return uniqueCategories.sort();
    },
  });

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    // Auto-open suggestions when typing
    if (newValue.length > 0 && !open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onChange(inputValue);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" && !open) {
      setOpen(true);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Show suggestions when there's input and matching categories
  const showSuggestions = inputValue.length > 0 && filteredCategories.length > 0;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={(e) => e.stopPropagation()}
            />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandList>
              {inputValue.length === 0 ? (
                <CommandEmpty>
                  <p className="p-4 text-sm text-muted-foreground">Start typing to see suggestions...</p>
                </CommandEmpty>
              ) : filteredCategories.length === 0 ? (
                <CommandEmpty>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">No matching categories found.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => handleSelect(inputValue)}
                    >
                      Create "{inputValue}"
                    </Button>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup heading="Suggested categories">
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => handleSelect(category)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === category ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>
                        {category.toLowerCase().startsWith(inputValue.toLowerCase()) ? (
                          <>
                            <span className="font-medium text-primary">
                              {category.substring(0, inputValue.length)}
                            </span>
                            {category.substring(inputValue.length)}
                          </>
                        ) : (
                          category
                        )}
                      </span>
                    </CommandItem>
                  ))}
                  {inputValue && !categories.some(cat => cat.toLowerCase() === inputValue.toLowerCase()) && (
                    <CommandItem
                      value={inputValue}
                      onSelect={() => handleSelect(inputValue)}
                      className="cursor-pointer border-t"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === inputValue ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-muted-foreground">Create "</span>
                      <span className="font-medium">{inputValue}</span>
                      <span className="text-muted-foreground">"</span>
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryCombobox;