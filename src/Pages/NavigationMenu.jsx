import * as React from "react";
import { NavigationMenu as ShadcnNavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

const NavigationMenu = ({ options, selectedOption, onSelect }) => {
  return (
    <ShadcnNavigationMenu className="mb-6">
      <NavigationMenuList className="flex gap-4">
        {options.map((option) => (
          <NavigationMenuItem key={option.value}>
            <NavigationMenuLink
              className={`cursor-pointer px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedOption === option.value
                  ? "bg-pink-500 text-gray hover:bg-pink-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  );
};

export default NavigationMenu;