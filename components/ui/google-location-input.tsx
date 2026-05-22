"use client";

import React, { InputHTMLAttributes, useEffect } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

interface GoogleLocationInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelected?: (lat: number, lng: number, address: string) => void;
}

export function GoogleLocationInput({ 
  value, 
  onChange, 
  onPlaceSelected, 
  className,
  ...props 
}: GoogleLocationInputProps) {
  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      const address = place.formatted_address || place.name || "";
      
      if (onChange) {
        onChange(address);
      }
      
      if (onPlaceSelected && place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onPlaceSelected(lat, lng, address);
      }
    },
    options: {
      types: ["(regions)"],
    },
  });

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value, ref]);

  return (
    <input
      ref={ref}
      defaultValue={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      className={className}
      {...props}
    />
  );
}
