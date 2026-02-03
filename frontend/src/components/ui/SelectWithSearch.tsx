import  { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import Input from './Input';
import { HiXMark } from 'react-icons/hi2';
import { X } from 'lucide-react';

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  name: string;
  possibleValues?: string[];
};

const SelectWithSearch = ({
  value,
  onValueChange,
  label,
  name,
  possibleValues,
}: Props) => {
  const [search, setSearch] = useState("");
  const [filtredValues, setFiltredValues] = useState(possibleValues);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter values
  useEffect(() => {
    setFiltredValues(
      possibleValues?.filter((p) =>
        p.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, possibleValues]);

  // Focus when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Re-focus after list changes
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [filtredValues, open]);

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={(e) => {
        setSearch("");
        onValueChange(e);
      }}
    >
      <div className="flex w-full gap-0">
        <SelectTrigger className="w-11/12 text-xs">
          <SelectValue placeholder={`Sélectionner un(e) ${label}`} />
        </SelectTrigger>

        {value && (
          <button
            type="button"
            onClick={() => onValueChange("")}
            className="w-1/12"
          >
            <X className="text-red-500 hover:scale-150" />
          </button>
        )}
      </div>

      <SelectContent id={`select-${name}`} className="bg-background-base">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 text-xs border rounded-md"
            placeholder={`Rechercher un(e) ${name}`}
          />

          <HiXMark
            onClick={() => setSearch("")}
            className="absolute right-2 text-red-500 cursor-pointer"
          />
        </div>

        {filtredValues?.map((val) => (
          <SelectItem key={val} value={val}>
            {val}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectWithSearch;
