type PreviewProps = {
    previews: string[];
  };
  
  export default function PreviewImage({ previews }: PreviewProps) {
    return (
      <div className="my-2 flex flex-wrap gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="size-36 border border-dashed border-primary rounded-md p-1"
            />
          </div>
        ))}
      </div>
    );
  }
  
