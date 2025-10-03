import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AnswerCardProps = {
  id: string;
  username: string;
  createdDate: Date;
  userImage: string;
  body: string;
};

export const AnswerCard = (props: AnswerCardProps) => {
  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      {/* header */}
      <div className="flex items-center gap-2">
        <Avatar className="size-14">
          <AvatarImage src={props.userImage ?? ""} />
          <AvatarFallback>
            {props.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-medium">{props.username}</p>
          <p className="text-muted-foreground text-sm">
            {props.createdDate.toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* content */}
      <div>
        <p>{props.body}</p>
      </div>
    </div>
  );
};
