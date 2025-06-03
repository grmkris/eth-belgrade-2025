"use client";

import { useState } from "react";
import { CalendarIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import ConnectButton from "@/components/ConnectButton";

// Import all components
import { Button } from "@workspace/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { Toggle } from "@workspace/ui/components/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

export default function Page() {
  const [date, setDate] = useState<Date>();
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      notifications: true,
      theme: "light",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">UI Components Showcase</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive demonstration of all available UI components
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>

        <Separator />

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <SettingsIcon />
            </Button>
          </div>
        </section>

        <Separator />

        {/* Form Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Form Components</h2>

          <Card>
            <CardHeader>
              <CardTitle>User Profile Form</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description about yourself.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notifications"
                        checked={checkboxChecked}
                        onCheckedChange={(checked) =>
                          setCheckboxChecked(
                            checked === "indeterminate" ? false : checked,
                          )
                        }
                      />
                      <Label htmlFor="notifications">
                        Enable notifications
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="marketing"
                        checked={switchChecked}
                        onCheckedChange={setSwitchChecked}
                      />
                      <Label htmlFor="marketing">Marketing emails</Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred contact method</Label>
                    <RadioGroup defaultValue="email">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="sms" />
                        <Label htmlFor="sms">SMS</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit">Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Card Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>A basic card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This is the card content area where you can put any
                  information.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Action</CardTitle>
                <CardDescription>Card with header action</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon">
                    <SettingsIcon />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p>This card has an action button in the header.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats Card</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-muted-foreground">Total users</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Interactive Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Interactive Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Date picker component</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Accordion */}
            <Card>
              <CardHeader>
                <CardTitle>Accordion</CardTitle>
                <CardDescription>Collapsible content sections</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is React?</AccordionTrigger>
                    <AccordionContent>
                      React is a JavaScript library for building user
                      interfaces, particularly web applications.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What is TypeScript?</AccordionTrigger>
                    <AccordionContent>
                      TypeScript is a programming language that adds static type
                      definitions to JavaScript.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
                    <AccordionContent>
                      Tailwind CSS is a utility-first CSS framework for rapidly
                      building custom user interfaces.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Overlay Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Overlay Components</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Popover Content</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a popover with some content inside.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Action</Button>
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a helpful tooltip</p>
              </TooltipContent>
            </Tooltip>

            {/* Toggle */}
            <Toggle
              pressed={togglePressed}
              onPressedChange={setTogglePressed}
              aria-label="Toggle italic"
            >
              <UserIcon />
            </Toggle>

            <Toggle variant="outline">
              <SearchIcon />
            </Toggle>
          </div>
        </section>

        <Separator />

        {/* Footer */}
        <footer className="text-center text-muted-foreground">
          <p>
            Component showcase built with React, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
