create function porcentage()
  returns TABLE(value timestamp , views FLOAT)
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
  if (percentage > (total * 0.01)) then
    RETURN  QUERY  Select time as value, percentage  into porcentage from log group by time order by percentage desc ;

  END IF ;
end;
$$;

alter function porcentage()
  owner to postgres;

