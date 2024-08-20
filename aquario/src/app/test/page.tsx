"use client";

import ComponentWithTailwind from "../../Tests & Examples/ComponentWithTailwind";
import ComponentWithShadcn from "../../Tests & Examples/ComponentWithShadcn";
import ComponentWithCss from "../../Tests & Examples/ComponentWithCss/ComponentWithCss";
import UserCardIan from "@/Tests & Examples/ComponentWithCSS-Ian/UserCardIan";

export default function Test() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Test Page</p>
        <UserCardIan/>
      </main>
    );
}
  