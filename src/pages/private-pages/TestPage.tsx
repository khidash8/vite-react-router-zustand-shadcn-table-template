import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.tsx";
import { EnhancedProductsTable } from "../../features/test-page/components/ProductsTable.tsx";
import { EnhancedUsersTable } from "../../features/test-page/components/UsersTable.tsx";

const TestPage = () => {
  return (
    <div className="mx-auto px-10 py-10">
      <Tabs defaultValue="products">
        <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
          <TabsTrigger
            value="products"
            className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <EnhancedProductsTable />
        </TabsContent>

        <TabsContent value="users">
          <EnhancedUsersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPage;
