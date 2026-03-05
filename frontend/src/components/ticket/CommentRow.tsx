
import type { Comment } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { fr } from 'date-fns/locale';
import { COMMENT_ACTIONS_DICTIONNAIRE } from '@/data/data';

const CommentRow = ({comment,className}:{comment:Comment,className?:string}) => {
 
  const actionName=(COMMENT_ACTIONS_DICTIONNAIRE as any)[comment.action]||comment.action;
  // COMMENT_ACTIONS_DICTIONNAIRE.relancer
  const actionBG=comment.action==="close"?" bg-yellow-200/20 ":comment.action==="relancer"?" bg-amber-400/20 ":comment.action==="trait"?" bg-teal-400/20 ":comment.action==="in_charge"?" bg-cyan-300/20 ":" bg-primary/20 "
  return (
    <div className={cn('flex flex-col gap-0 min-h-28 lg:max-h-45 bg-primary/20 my-2 text-start rounded-md  rounded-br-4xl rounded-tl-4xl shadow-2xl shadow-black w-full px-5 py-2 text-xs lg:text-sm',className,actionBG)}>
   <p className=' capitalize font-semibold italic'>{`${actionName} par (${comment.author?.name})`} </p>
   <p className='text-xs overflow-y-auto my-2 lg:my-4'> {comment.message} 
    {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat in vel animi nesciunt maiores odit, facilis sed nulla similique nam ad dicta non laboriosam reiciendis inventore quam necessitatibus ex itaque?
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero commodi aliquam nam suscipit omnis nulla autem maxime a tempora magnam, dolor itaque odio eveniet exercitationem rem corporis fuga tempore!
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium quia alias inventore excepturi ducimus neque officia, maiores eum accusamus nobis nam voluptate ab beatae dolores dicta. Veritatis cum aperiam eum.
    */}
    </p>
   <p className='text-text-primary font-bold italic text-xs mt-auto'>{format(comment.updatedAt??comment.createdAt,"EEEE dd/MM/yyyy HH:mm:ss",{ locale: fr })} </p>
    </div>
  );
};

export default CommentRow;