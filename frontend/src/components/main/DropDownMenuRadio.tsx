


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Button from "../ui/Button"

export function DropdownMenuRadio({buttonTitle,title,list,choosen,setChoosen}:{buttonTitle:string; title:string;list:string[];choosen:string;setChoosen:any}) {
 
    if(!list||list.length<1)return;
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button text={buttonTitle||"Ouvrir"} variant="primary" className="flex w-fit gap-4 items-center h-fit px-4 py-1 border text-primary border-gray-hot rounded-lg hover:font-semibold hover:border-primary bg-white shadow-2xl disabled:text-gray-cold transition-all text-sm"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit bg-background-base">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={choosen} onValueChange={setChoosen}>
            {list.map(l=>

                (<DropdownMenuRadioItem value={l}> {l.toUpperCase()} </DropdownMenuRadioItem>)
            )}
          
           
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
