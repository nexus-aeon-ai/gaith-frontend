"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createSettingsSchema,
  type CreateSettingsFormData,
  defaultFormData,
} from "@/lib/validations/settings";

import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";

interface ClientFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const NotificationForm = ({ onSubmit }: ClientFormProps) => {

  const form = useForm<CreateSettingsFormData>({
    resolver: zodResolver(createSettingsSchema),
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto m-0 font-inter"
      >
        {/* Email Notifications */}
        <Card className="m-0 pt-3 rounded-none shadow-none">
          <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-md font-bold">Email Notifications</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">New Client Added</p>
                    <p className="text-sm font-[400]">
                      Get notified when a new client is added to the system
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="newClientAdded"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Client Status Changes</p>
                    <p className="text-sm font-[400]">
                      Receive updates when client status is modified
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="clientStatusChanged"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Weekly Reports</p>
                    <p className="text-sm font-[400]">Get weekly summary reports via email</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="weeklyReports"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* sms notifications */}
        <Card className="m-0 pt-3 rounded-none shadow-none">
          <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-md font-bold">SMS Notifications</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Enable SMS Alerts</p>
                    <p className="text-sm font-[400]">
                      Show browser notifications for important updates
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="enableSMSAlerts"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Enable SMS Alerts</p>
                    <p className="text-sm font-[400]">
                      Play sound when a new notification is received
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="enableSMSAlerts"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between  px-2 p-4">
                  <div className="flex flex-col w-full ">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0096777777777"
                              className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="m-0 pt-3 rounded-none rounded-b-[12px] shadow-none">
          <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-md font-bold">In-App Notifications</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Desktop Notifications</p>
                    <p className="text-sm font-[400]">Receive important notifications via SMS</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="desktopNotifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Sound Alerts</p>
                    <p className="text-sm font-[400]">Receive important notifications via SMS</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="soundAlerts"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between  px-2 p-4">
                  <div className="flex flex-col w-full ">
                    <FormField
                      control={form.control}
                      name="notificationFrequency"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Notifications Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5min">Every 5 minutes</SelectItem>
                              <SelectItem value="15min">Every 15 minutes</SelectItem>
                              <SelectItem value="1hr">Every 1 hour</SelectItem>
                              <SelectItem value="4hrs">Every 4 hours</SelectItem>
                              <SelectItem value="12hrs">Every 12 hours</SelectItem>
                              <SelectItem value="24hrs">Every 24 hours</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default NotificationForm;
