# Delete CloudFormation Stack
echo "Please enter Serverless Stack Name:"
read stackName
if [ -z "$stackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$stackName"


echo "Deleting CloudFormation Stack"
aws cloudformation delete-stack --stack-name $stackName

aws cloudformation wait stack-delete-complete --stack-name $stackName

echo "Cloudformation Stack deleted"
