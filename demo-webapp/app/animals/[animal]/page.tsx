import Image from "next/image";
import { notFound } from "next/navigation";
import { ANIMALS, AnimalKey } from "@/lib/animals";

function spanClasses(col: number, row: number) {
  const colMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
  };
  const rowMap: Record<number, string> = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
  };
  return `${colMap[col] ?? "col-span-2"} ${rowMap[row] ?? "row-span-1"}`;
}

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ animal: string }>;
}) {
  const { animal } = await params;
  const key = animal as AnimalKey;
  const info = ANIMALS[key];
  if (!info) return notFound();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[140px]">
          {info.photos.map((item, idx) => {
            const col = item.spanCol ?? 2;
            const row = item.spanRow ?? 1;
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl bg-content1 ${spanClasses(col, row)}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority={idx < 2}
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </div>
      <aside className="lg:col-span-1 space-y-4">
        <h1 className="text-3xl font-semibold">{info.title}</h1>
        <p className="text-default-700">{info.description}</p>
        <div className="rounded-xl border border-default-200 p-4 bg-content1">
          <h3 className="font-medium">Scientific info</h3>
          <ul className="mt-2 text-sm text-default-700 space-y-1">
            {info.facts.map((f, i) => (
              <li key={i}>
                <span className="text-default-500">{f.label}:</span> {f.value}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
