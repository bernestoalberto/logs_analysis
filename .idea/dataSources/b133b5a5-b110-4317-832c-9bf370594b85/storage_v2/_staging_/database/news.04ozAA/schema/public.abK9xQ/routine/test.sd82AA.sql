create function test()
  returns table(views timestamp without TIME ZONE, percentage float)
language plpgsql
as $$
DECLARE
  part float;
  total float;
  percentage float;
BEGIN
  Select  count(*)into part From log where log.status like '%404%' ;
  Select count(*) into total from log;
  percentage:= (part * 100) / total;
  if(percentage > 5) then
    RETURN QUERY SELECT time as views, percentage from log;
  else
    RETURN  QUERY SELECT count(*),percentage from log;
    end if ;
END;
$$;

alter function test()
  owner to postgres;

