import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { RiMoreFill } from "@remixicon/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { Card } from "../../components/Card";
import { Dropzone } from "../../components/Dropzone";
import { FileUploadCard } from "../../components/FileUploadCard";
import { Text } from "../../components/Text";
import { m } from "../../paraglide/messages";
import { useUploadStore } from "../../stores/UploadStore";

const LogoCard = ({ children }: PropsWithChildren) => (
  <Card className="w-16 h-16 md:w-20 md:h-20 flex justify-center items-center">
    {children}
  </Card>
);

export const Upload = () => {
  const { queue, addFiles } = useUploadStore();
  const sortedQueue = queue.toSorted((a, b) => {
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <Text color="subtle">
        <ParaglideMessage
          message={m.upload_payroll_message}
          inputs={{}}
          markup={{
            link: ({ children, options }) => (
              <Link to={options.to}>
                <Text color="primary" underlined>
                  {children}
                </Text>
              </Link>
            ),
          }}
        />
      </Text>
      <Dropzone onDrop={addFiles}>
        <div className="flex flex-col gap-12 items-center">
          <div className="flex gap-4">
            <LogoCard>
              <img src="/datev-logo.svg" alt={m.datev_logo()} />
            </LogoCard>
            <LogoCard>
              <img src="/sage-logo.svg" alt={m.sage_logo()} />
            </LogoCard>
            <LogoCard>
              <RiMoreFill className="text-attention" />
            </LogoCard>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <Text className="text-center">
              <ParaglideMessage
                message={m.drag_files_here}
                inputs={{}}
                markup={{
                  link: ({ children }) => (
                    <Text color="primary" underlined>
                      {children}
                    </Text>
                  ),
                }}
              />
            </Text>
            <Text color="subtle" variant="caption">
              {m.drag_files_here_hint()}
            </Text>
          </div>
        </div>
      </Dropzone>
      <div className="flex flex-col gap-4">
        {sortedQueue.map((item) => (
          <FileUploadCard key={item.fileId} queueItem={item} />
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/upload")({
  component: Upload,
  head: () => ({
    meta: [
      {
        title: m.page_title({ page: m.upload_payrolls() }),
      },
    ],
  }),
  staticData: {
    title: m.upload_payrolls(),
    renderFloatingButton: false,
  },
});
