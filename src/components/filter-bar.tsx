"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  area: string;
  setArea: (value: string) => void;
  selectedPIC: string;
  setSelectedPIC: (value: string) => void;
};

export function FilterBar({ area, setArea, selectedPIC, setSelectedPIC }: Props) {
  const picOptions = ["All", "Galih Nurdiansyah", "Sinta Lestari", "Deni Kurniawan", "Bima Ramadhan", "Maria Fransisca", "Aldi Suryana", "Farah Annisa", "Wahyu Hidayat", "Shinta Wahyuni"];

  return (
    <div className="flex flex-wrap gap-4">
      <Select value={area} onValueChange={setArea}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pilih Area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="East">East</SelectItem>
          <SelectItem value="Jabo">Jabo</SelectItem>
          <SelectItem value="North">North</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPIC} onValueChange={setSelectedPIC}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Pilih PIC" />
        </SelectTrigger>
        <SelectContent>
          {picOptions.map((pic) => (
            <SelectItem key={pic} value={pic}>
              {pic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
